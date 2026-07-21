import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, LogOut, Search, Package, AlertTriangle,
  TrendingUp, IndianRupee, X, Upload, CheckCircle, Info, ExternalLink,
  ClipboardList, Eye, Clock, ShoppingBag, RefreshCw, Mail, Tag, Calendar
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


interface AdminDashboardProps {
  onLogout: () => void;
  onRefreshProducts: () => void;
  productsList: Product[];
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'loading';
  message: string;
}

export default function AdminDashboard({ onLogout, onRefreshProducts, productsList }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>(productsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Navigation & Sections State
  const [activeSection, setActiveSection] = useState<'products' | 'orders' | 'subscribers'>('products');

  // Orders Section State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderItemsList, setOrderItemsList] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Newsletter Subscribers Section State
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subscriberSearchQuery, setSubscriberSearchQuery] = useState('');
  const [isDeleteSubscriberModalOpen, setIsDeleteSubscriberModalOpen] = useState(false);
  const [currentSubscriber, setCurrentSubscriber] = useState<any | null>(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Sparklers');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formBadgeColor, setFormBadgeColor] = useState('#D4AF37');

  // Image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [useUrlInsteadOfFile, setUseUrlInsteadOfFile] = useState(false);

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [adminEmail, setAdminEmail] = useState<string>('Authorized Admin');

  // Fetch orders list
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      showToast('error', 'Failed to fetch orders: ' + err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch subscribers list
  const fetchSubscribers = async () => {
    setSubscribersLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (err: any) {
      console.error('Error fetching subscribers:', err);
      showToast('error', 'Failed to fetch subscribers: ' + err.message);
    } finally {
      setSubscribersLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'orders') {
      fetchOrders();
    } else if (activeSection === 'subscribers') {
      fetchSubscribers();
    }
  }, [activeSection]);

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    const toastId = showToast('loading', 'Updating order status...');
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast('success', `Order status updated to ${newStatus}!`);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      showToast('error', 'Failed to update status: ' + err.message);
    } finally {
      removeToast(toastId);
    }
  };

  const handleViewOrderDetails = async (order: any) => {
    setSelectedOrder(order);
    setItemsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', order.id)
        .single();

      if (error) throw error;
      if (data) {
        setSelectedOrder(data);
        const details = data.order_details;
        if (details) {
          const parsedItems = typeof details === 'string' ? JSON.parse(details) : details;
          setOrderItemsList(Array.isArray(parsedItems) ? parsedItems : []);
        } else {
          setOrderItemsList([]);
        }
      }
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      showToast('error', 'Failed to load order details: ' + err.message);
    } finally {
      setItemsLoading(false);
    }
  };

  const handlePrintInvoice = () => {
    if (!selectedOrder) return;

    try {
      const doc = new jsPDF();

      // Title / Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(180, 140, 40); // Luxury Gold
      doc.text('SRI MAHALAKSHMI CRACKERS', 14, 20);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Premium Sivakasi Crackers Direct to Your Doorstep', 14, 26);

      // Horizontal Line divider
      doc.setDrawColor(220, 220, 220);
      doc.line(14, 30, 196, 30);

      // Order Information Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('ORDER INFORMATION', 14, 38);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);

      const orderIdVal = selectedOrder.order_id || `ORD-${selectedOrder.id}`;
      const orderDateVal = new Date(selectedOrder.created_at).toLocaleString('en-IN');

      doc.text(`Order ID: ${orderIdVal}`, 14, 45);
      doc.text(`Date & Time: ${orderDateVal}`, 14, 50);
      doc.text(`Payment Method: ${selectedOrder.payment_method}`, 14, 55);
      doc.text(`Current Status: ${selectedOrder.status}`, 14, 60);
      if (selectedOrder.delivery_date) {
        const formattedDate = new Date(selectedOrder.delivery_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
        doc.text(`Preferred Delivery: ${formattedDate}`, 14, 65);
      }

      // Customer Details Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('CUSTOMER DETAILS', 120, 38);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`Name: ${selectedOrder.customer_name}`, 120, 45);
      doc.text(`Phone: ${selectedOrder.phone}`, 120, 50);
      doc.text(`City: ${selectedOrder.city || 'N/A'}`, 120, 55);
      doc.text(`Pincode: ${selectedOrder.pincode}`, 120, 60);

      let nextY = 65;
      if (selectedOrder.landmark) {
        doc.text(`Landmark: ${selectedOrder.landmark}`, 120, nextY);
        nextY += 5;
      }

      // Address word-wrapping
      const addressLines = doc.splitTextToSize(`Address: ${selectedOrder.address}`, 75);
      doc.text(addressLines, 120, nextY);

      // Horizontal Line divider
      doc.line(14, 82, 196, 82);

      // Table Header and Body
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('ORDER ITEMS', 14, 90);

      const tableData = orderItemsList.map((item) => [
        item.name || item.product_name,
        item.qty,
        `Rs. ${item.price.toLocaleString('en-IN')}`,
        `Rs. ${(item.price * item.qty).toLocaleString('en-IN')}`
      ]);

      autoTable(doc, {
        startY: 96,
        head: [['Product Name', 'Quantity', 'Unit Price', 'Subtotal']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [180, 140, 40], textColor: [255, 255, 255] }, // Luxury gold header
        styles: { font: 'helvetica', fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { halign: 'center', cellWidth: 25 },
          2: { halign: 'center', cellWidth: 35 },
          3: { halign: 'right', cellWidth: 35 }
        }
      });

      // Payment Summary
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Grand Total: Rs. ${selectedOrder.total_amount.toLocaleString('en-IN')}`, 196, finalY, { align: 'right' });

      // Save PDF
      doc.save(`Invoice-${orderIdVal}.pdf`);
      showToast('success', 'PDF Invoice generated and downloaded successfully!');
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      showToast('error', 'Failed to generate PDF: ' + err.message);
    }
  };

  // Delete Subscriber Handler
  const handleDeleteSubscriberConfirm = async () => {
    if (!currentSubscriber?.id) return;

    setSubmitLoading(true);
    const toastId = showToast('loading', 'Deleting subscriber record...');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', currentSubscriber.id);

      if (error) throw error;

      showToast('success', 'Subscriber removed successfully!');
      setIsDeleteSubscriberModalOpen(false);
      setCurrentSubscriber(null);
      fetchSubscribers();
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || 'Failed to delete subscriber.');
    } finally {
      removeToast(toastId);
      setSubmitLoading(false);
    }
  };

  // Sync state if parent productsList changes
  useEffect(() => {
    setProducts(productsList);
  }, [productsList]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setAdminEmail(user.email);
      }
    });
  }, []);

  // Show toast utility
  const showToast = (type: 'success' | 'error' | 'loading', message: string, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);

    if (type !== 'loading' && duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Preset categories
  const categoriesList = [
    'Sparklers', 'Gift Boxes', 'Rockets', 'Flower Pots',
    'Ground Chakkars', 'Atom Bomb', 'Fancy Items', 'Sound Crackers'
  ];

  // Badges preset
  const badgesList = [
    { label: 'None', value: '' },
    { label: 'Best Seller', value: 'Best Seller', color: '#D4AF37' },
    { label: 'New Arrival', value: 'New Arrival', color: '#D4AF37' },
    { label: 'Top Rated', value: 'Top Rated', color: '#5B0A1A' },
    { label: 'Premium', value: 'Premium', color: '#5B0A1A' },
    { label: 'Exclusive', value: 'Exclusive', color: '#5B0A1A' },
    { label: 'Limited', value: 'Limited', color: '#A88A1A' }
  ];

  // Stats calculation
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= 10 && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const totalCatalogValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  // Order stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((acc, o) => acc + o.total_amount, 0);

  // Subscriber stats
  const totalSubscribers = subscribers.length;

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.trim().toUpperCase() === selectedCategory.trim().toUpperCase();
    return matchesSearch && matchesCategory;
  });

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const term = orderSearchQuery.toLowerCase();
    return (
      o.customer_name.toLowerCase().includes(term) ||
      o.phone.includes(term) ||
      o.pincode.includes(term) ||
      String(o.id).includes(term) ||
      (o.order_id && o.order_id.toLowerCase().includes(term))
    );
  });

  // Filtered subscribers list
  const filteredSubscribers = subscribers.filter(s => {
    const term = subscriberSearchQuery.toLowerCase();
    const couponVal = s.coupon || s.coupon_code || '';
    return (
      (s.email && s.email.toLowerCase().includes(term)) ||
      (couponVal && couponVal.toLowerCase().includes(term))
    );
  });

  // Handle Image input changes
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormErrors(prev => ({ ...prev, image: 'Supported formats: JPG, JPEG, PNG, WEBP' }));
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }

    // Clear image error
    setFormErrors(prev => {
      const copy = { ...prev };
      delete copy.image;
      return copy;
    });

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Open Add Form
  const handleOpenAddModal = () => {
    setCurrentProduct(null);
    setFormName('');
    setFormCategory('Sparklers');
    setFormCustomCategory('');
    setFormDescription('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormStock('');
    setFormBadge('');
    setFormBadgeColor('#D4AF37');
    setImageFile(null);
    setImagePreview(null);
    setImageUrlInput('');
    setUseUrlInsteadOfFile(false);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Form
  const handleOpenEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormName(product.name);

    if (categoriesList.includes(product.category)) {
      setFormCategory(product.category);
      setFormCustomCategory('');
    } else {
      setFormCategory('Other');
      setFormCustomCategory(product.category);
    }

    setFormDescription(product.description || '');
    setFormPrice(String(product.price));
    setFormOriginalPrice(String(product.original_price || product.price));
    setFormStock(String(product.stock));
    setFormBadge(product.badge || '');
    setFormBadgeColor(product.badgeColor || '#D4AF37');
    setImageFile(null);
    setImagePreview(product.image);
    setImageUrlInput(product.image || '');
    setUseUrlInsteadOfFile(product.image ? !product.image.includes('.supabase.co/') : false);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Delete Dialog
  const handleOpenDeleteModal = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Form Valdiation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formName.trim() || formName.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }
    if (formCategory === 'Other' && !formCustomCategory.trim()) {
      errors.category = 'Please enter a custom category';
    }
    if (!formDescription.trim() || formDescription.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    const priceNum = Number(formPrice);
    if (!formPrice || isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be a positive number';
    }

    const origPriceNum = Number(formOriginalPrice);
    if (!formOriginalPrice || isNaN(origPriceNum) || origPriceNum <= 0) {
      errors.originalPrice = 'Original price must be a positive number';
    } else if (origPriceNum < priceNum) {
      errors.originalPrice = 'Original price should be greater than or equal to sale price';
    }

    const stockNum = Number(formStock);
    if (formStock === '' || isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      errors.stock = 'Stock must be a non-negative whole number';
    }

    if (!useUrlInsteadOfFile && !imageFile && !imagePreview) {
      errors.image = 'Product image is required';
    }
    if (useUrlInsteadOfFile && !imageUrlInput.trim()) {
      errors.image = 'Image URL is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper to extract bucket file path from public URL
  const getStoragePathFromUrl = (url: string) => {
    if (!url || !url.includes('.supabase.co/storage/v1/object/public/products/')) return null;
    try {
      const parts = url.split('/products/');
      return parts[parts.length - 1];
    } catch (e) {
      return null;
    }
  };

  // Helper to delete an image file from storage
  const deleteImageFromStorage = async (url: string) => {
    const path = getStoragePathFromUrl(url);
    if (!path) return;

    try {
      const { error } = await supabase.storage.from('products').remove([path]);
      if (error) console.error("Error deleting old image:", error.message);
    } catch (err) {
      console.error("Storage removal error:", err);
    }
  };

  // Upload file to Supabase Storage
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
    const filePath = `product_images/${fileName}`;

    const { error } = await supabase.storage.from('products').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

    if (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }

    const { data } = supabase.storage.from('products').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Submit Add/Edit Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    const toastId = showToast('loading', currentProduct ? 'Updating product details...' : 'Creating new product...');

    try {
      let finalImageUrl = imagePreview || '';

      // Upload new image file if selected
      if (!useUrlInsteadOfFile && imageFile) {
        finalImageUrl = await uploadImage(imageFile);

        // If editing and we have a previous Supabase uploaded image, delete the old one
        if (currentProduct && currentProduct.image && currentProduct.image !== finalImageUrl) {
          await deleteImageFromStorage(currentProduct.image);
        }
      } else if (useUrlInsteadOfFile) {
        finalImageUrl = imageUrlInput.trim();
        // If editing and URL changed, clean up previous Supabase uploaded image
        if (currentProduct && currentProduct.image && currentProduct.image !== finalImageUrl) {
          await deleteImageFromStorage(currentProduct.image);
        }
      }

      const categoryValue = formCategory === 'Other' ? formCustomCategory.trim() : formCategory;
      const computedDiscount = Math.round(((Number(formOriginalPrice) - Number(formPrice)) / Number(formOriginalPrice)) * 100);

      const productPayload = {
        name: formName.trim(),
        category: categoryValue,
        description: formDescription.trim(),
        price: Number(formPrice),
        original_price: Number(formOriginalPrice),
        stock: Number(formStock),
        image: finalImageUrl,
        badge: formBadge || null,
        badgeColor: formBadge ? formBadgeColor : null,
        discount: computedDiscount > 0 ? computedDiscount : 0,
      };

      if (currentProduct?.id) {
        // Edit Row
        const { error } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', currentProduct.id);

        if (error) throw error;
        showToast('success', 'Product updated successfully!');
      } else {
        // Add Row
        const { error } = await supabase
          .from('products')
          .insert([productPayload]);

        if (error) throw error;
        showToast('success', 'Product created successfully!');
      }

      // Close modal and refresh lists
      setIsFormModalOpen(false);
      onRefreshProducts();
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || 'Operation failed. Please try again.');
    } finally {
      removeToast(toastId);
      setSubmitLoading(false);
    }
  };

  // Submit Delete Product
  const handleDeleteConfirm = async () => {
    if (!currentProduct?.id) return;

    setSubmitLoading(true);
    const toastId = showToast('loading', 'Deleting product and assets...');

    try {
      // First delete associated storage image if exists
      if (currentProduct.image) {
        await deleteImageFromStorage(currentProduct.image);
      }

      // Delete database row
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', currentProduct.id);

      if (error) throw error;

      showToast('success', 'Product and its image deleted successfully!');
      setIsDeleteModalOpen(false);
      onRefreshProducts();
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || 'Failed to delete product.');
    } finally {
      removeToast(toastId);
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white font-body flex flex-col md:flex-row relative">

      {/* ── Toast Notifications Overlay ── */}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="pointer-events-auto w-full glass-card p-4 rounded-sm border border-luxury-gold/20 flex items-start gap-3 shadow-luxury"
            >
              {toast.type === 'loading' && (
                <svg className="animate-spin h-5 w-5 text-luxury-gold shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {toast.type === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              )}
              {toast.type === 'error' && (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/30 hover:text-white/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Left Sidebar Navigation ── */}
      <aside className="w-full md:w-64 bg-black border-b md:border-b-0 md:border-r border-luxury-gold/15 flex flex-col justify-between shrink-0 p-6">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold tracking-wider text-white">SMC ADMIN</h2>
              <p className="text-[10px] uppercase text-luxury-gold tracking-widest font-semibold">Dashboard Panel</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-body text-xs uppercase tracking-wider font-semibold transition-all ${activeSection === 'products'
                ? 'bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold'
                : 'bg-transparent border border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
                }`}
            >
              <Package className="w-4 h-4" />
              Product Catalog
            </button>
            <button
              onClick={() => setActiveSection('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-body text-xs uppercase tracking-wider font-semibold transition-all ${activeSection === 'orders'
                ? 'bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold'
                : 'bg-transparent border border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
                }`}
            >
              <ClipboardList className="w-4 h-4" />
              Orders List
            </button>
            <button
              onClick={() => setActiveSection('subscribers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-body text-xs uppercase tracking-wider font-semibold transition-all ${activeSection === 'subscribers'
                ? 'bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold'
                : 'bg-transparent border border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
                }`}
            >
              <Mail className="w-4 h-4" />
              Newsletter Subscribers
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-semibold">Active Session</span>
            <span className="text-xs text-white/70 truncate">{adminEmail}</span>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-sm border border-red-950 bg-red-950/20 text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all font-body text-xs font-semibold uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Dashboard Workspace ── */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">

        {activeSection === 'products' ? (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white mb-1.5">
                  Product <span className="gold-gradient-text">Management</span>
                </h1>
                <p className="text-sm text-white/40 font-body">Create, update, and manage your premium firework catalogs</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-2 px-5 py-3.5 bg-luxury-gold text-luxury-black font-body text-xs font-bold tracking-wider uppercase rounded-sm shadow-gold hover:bg-luxury-gold-light transition-all duration-300"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                Add New Product
              </motion.button>
            </div>

            {/* Stats Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Card 1 */}
              <div className="glass-card p-5 rounded-sm border border-luxury-gold/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-white/45 tracking-wider font-semibold mb-1">Total Products</p>
                  <h3 className="font-heading text-2xl font-bold text-white">{totalProducts}</h3>
                </div>
                <div className="w-10 h-10 rounded-sm bg-white/[0.03] border border-white/10 flex items-center justify-center text-luxury-gold">
                  <Package className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass-card p-5 rounded-sm border border-luxury-gold/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-white/45 tracking-wider font-semibold mb-1">Low Stock (≤10)</p>
                  <h3 className="font-heading text-2xl font-bold text-orange-400">{lowStockProducts}</h3>
                </div>
                <div className="w-10 h-10 rounded-sm bg-orange-950/20 border border-orange-900/30 flex items-center justify-center text-orange-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass-card p-5 rounded-sm border border-luxury-gold/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-white/45 tracking-wider font-semibold mb-1">Out of Stock</p>
                  <h3 className="font-heading text-2xl font-bold text-red-500">{outOfStockProducts}</h3>
                </div>
                <div className="w-10 h-10 rounded-sm bg-red-950/20 border border-red-900/30 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              {/* Card 4 */}
              <div className="glass-card p-5 rounded-sm border border-luxury-gold/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-white/45 tracking-wider font-semibold mb-1">Catalog Value</p>
                  <h3 className="font-heading text-2xl font-bold text-luxury-gold">₹{totalCatalogValue.toLocaleString('en-IN')}</h3>
                </div>
                <div className="w-10 h-10 rounded-sm bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
            </section>

            {/* Filter & Search Bar */}
            <section className="flex flex-col sm:flex-row items-center gap-4 bg-white/[0.01] border border-white/[0.06] p-4 rounded-sm">
              {/* Search */}
              <div className="relative w-full sm:flex-1">
                <Search className="absolute inset-y-0 left-3.5 my-auto w-4.5 h-4.5 text-white/35" />
                <input
                  type="text"
                  placeholder="Search products by name, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 pl-11 pr-4 text-white font-body text-xs placeholder:text-white/20 focus:outline-none focus:border-luxury-gold transition-colors duration-300"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
                {['All', ...categoriesList].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2.5 rounded-sm font-body text-[10px] font-bold uppercase tracking-wider border shrink-0 transition-all ${selectedCategory === category
                      ? 'bg-luxury-gold border-luxury-gold text-luxury-black'
                      : 'bg-transparent border-white/10 text-white/50 hover:border-white/25 hover:text-white'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>

            {/* Products List Table / Cards */}
            <section className="glass-card rounded-sm overflow-hidden border border-white/[0.06] shadow-luxury">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-luxury-gold/15 bg-black/40 text-[10px] uppercase font-bold text-luxury-gold tracking-wider">
                      <th className="py-4 px-6">Product info</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6 text-right">Price</th>
                      <th className="py-4 px-6 text-right">Discount Price</th>
                      <th className="py-4 px-6 text-center">Stock</th>
                      <th className="py-4 px-6 text-center">Badge</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] font-body text-xs">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-white/40">
                          No products found matching the criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-white/[0.01] transition-colors group">
                          {/* Product Info */}
                          <td className="py-4 px-6 flex items-center gap-4 min-w-[280px]">
                            <img
                              src={product.image || '/placeholder-cracker.jpg'}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-sm border border-white/10 bg-black/40"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=100&q=80';
                              }}
                            />
                            <div className="truncate">
                              <p className="font-heading text-sm font-bold text-white leading-tight group-hover:text-luxury-gold transition-colors">{product.name}</p>
                              <p className="text-[10px] text-white/40 max-w-[200px] truncate">{product.description || 'No description provided'}</p>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-6 text-white/70">
                            <span className="px-2 py-1 rounded-sm bg-white/5 border border-white/10 text-[10px] tracking-wider uppercase font-semibold">
                              {product.category}
                            </span>
                          </td>

                          {/* Original Price */}
                          <td className="py-4 px-6 text-right text-white/50 line-through">
                            ₹{product.original_price?.toLocaleString('en-IN') || '0'}
                          </td>

                          {/* Price */}
                          <td className="py-4 px-6 text-right font-semibold text-luxury-gold">
                            ₹{product.price.toLocaleString('en-IN')}
                            {product.discount ? (
                              <span className="block text-[9px] text-green-400">({product.discount}% OFF)</span>
                            ) : null}
                          </td>

                          {/* Stock */}
                          <td className="py-4 px-6 text-center">
                            <span className={`font-semibold ${product.stock === 0
                              ? 'text-red-500'
                              : product.stock <= 10
                                ? 'text-orange-400'
                                : 'text-white/80'
                              }`}>
                              {product.stock}
                            </span>
                          </td>

                          {/* Badge */}
                          <td className="py-4 px-6 text-center">
                            {product.badge ? (
                              <span
                                className="inline-block px-2 py-0.5 text-[9px] tracking-wider uppercase font-bold rounded-sm text-white"
                                style={{ backgroundColor: product.badgeColor || '#D4AF37' }}
                              >
                                {product.badge}
                              </span>
                            ) : (
                              <span className="text-white/20">-</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEditModal(product)}
                                className="w-8 h-8 rounded-sm bg-white/5 hover:bg-luxury-gold/25 border border-white/10 hover:border-luxury-gold/50 flex items-center justify-center text-white/60 hover:text-luxury-gold transition-all"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenDeleteModal(product)}
                                className="w-8 h-8 rounded-sm bg-white/5 hover:bg-red-950 border border-white/10 hover:border-red-900/50 flex items-center justify-center text-white/60 hover:text-red-400 transition-all"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="block md:hidden divide-y divide-white/[0.04] p-4 space-y-4">
                {filteredProducts.length === 0 ? (
                  <p className="py-8 text-center text-white/40 font-body text-xs">No products found matching the criteria.</p>
                ) : (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="pt-4 first:pt-0 flex flex-col gap-3 font-body text-xs text-white/80">
                      <div className="flex gap-3">
                        <img
                          src={product.image || '/placeholder-cracker.jpg'}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-sm border border-white/10 bg-black/40 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=100&q=80';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading text-sm font-bold text-white truncate leading-tight">{product.name}</h4>
                          <p className="text-[10px] text-white/40 truncate mt-1">{product.description || 'No description provided'}</p>
                          <div className="flex gap-2 items-center mt-2 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[9px] uppercase tracking-wider font-semibold">
                              {product.category}
                            </span>
                            {product.badge && (
                              <span
                                className="px-1.5 py-0.5 text-[9px] tracking-wider uppercase font-bold rounded-sm text-white"
                                style={{ backgroundColor: product.badgeColor || '#D4AF37' }}
                              >
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-sm border border-white/[0.03] gap-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-white/40 uppercase">Price Details</span>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="font-semibold text-luxury-gold">₹{product.price.toLocaleString('en-IN')}</span>
                            <span className="line-through text-white/45 text-[10px]">₹{product.original_price?.toLocaleString('en-IN') || '0'}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-white/40 uppercase">Stock</span>
                          <span className={`font-semibold mt-0.5 ${product.stock === 0 ? 'text-red-500' : product.stock <= 10 ? 'text-orange-400' : 'text-white/80'}`}>
                            {product.stock}
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="w-8 h-8 rounded-sm bg-white/5 hover:bg-luxury-gold/25 border border-white/10 flex items-center justify-center text-white/60"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(product)}
                            className="w-8 h-8 rounded-sm bg-white/5 hover:bg-red-950 border border-white/10 flex items-center justify-center text-white/60"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        ) : activeSection === 'orders' ? (
          <>
            {/* Orders Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white mb-1.5">
                  Order <span className="gold-gradient-text">Management</span>
                </h1>
                <p className="text-sm text-white/40 font-body">Review customer invoices and update order delivery status</p>
              </div>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-luxury-gold/30 rounded-sm bg-white/[0.02] text-white/60 hover:text-luxury-gold transition-all duration-300 font-body text-xs font-semibold tracking-wider uppercase"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Orders
              </button>
            </div>

            {/* Orders Stats Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="glass-card p-5 rounded-sm border border-luxury-gold/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-white/45 tracking-wider font-semibold mb-1">Total Orders</p>
                  <h3 className="font-heading text-2xl font-bold text-white">{totalOrders}</h3>
                </div>
                <div className="w-10 h-10 rounded-sm bg-white/[0.03] border border-white/10 flex items-center justify-center text-luxury-gold">
                  <ClipboardList className="w-5 h-5" />
                </div>
              </div>
              <div className="glass-card p-5 rounded-sm border border-luxury-gold/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-white/45 tracking-wider font-semibold mb-1">Pending Orders</p>
                  <h3 className="font-heading text-2xl font-bold text-yellow-400">{pendingOrders}</h3>
                </div>
                <div className="w-10 h-10 rounded-sm bg-yellow-950/20 border border-yellow-900/30 flex items-center justify-center text-yellow-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="glass-card p-5 rounded-sm border border-luxury-gold/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-white/45 tracking-wider font-semibold mb-1">Delivered Orders</p>
                  <h3 className="font-heading text-2xl font-bold text-green-400">{completedOrders}</h3>
                </div>
                <div className="w-10 h-10 rounded-sm bg-green-950/20 border border-green-900/30 flex items-center justify-center text-green-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="glass-card p-5 rounded-sm border border-luxury-gold/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-white/45 tracking-wider font-semibold mb-1">Total Revenue</p>
                  <h3 className="font-heading text-2xl font-bold text-luxury-gold">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                </div>
                <div className="w-10 h-10 rounded-sm bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
            </section>

            {/* Orders Filter & Search */}
            <section className="flex flex-col sm:flex-row items-center gap-4 bg-white/[0.01] border border-white/[0.06] p-4 rounded-sm">
              <div className="relative w-full">
                <Search className="absolute inset-y-0 left-3.5 my-auto w-4.5 h-4.5 text-white/35" />
                <input
                  type="text"
                  placeholder="Search orders by customer name, phone, pincode or ID..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 pl-11 pr-4 text-white font-body text-xs placeholder:text-white/20 focus:outline-none focus:border-luxury-gold transition-colors duration-300"
                />
              </div>
            </section>

            {/* Orders List Table / Cards */}
            <section className="glass-card rounded-sm overflow-hidden border border-white/[0.06] shadow-luxury">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-luxury-gold/15 bg-black/40 text-[10px] uppercase font-bold text-luxury-gold tracking-wider">
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Customer Details</th>
                      <th className="py-4 px-6 text-right">Amount</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] font-body text-xs text-white/80">
                    {ordersLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-white/40">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="animate-spin h-5 w-5 text-luxury-gold mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading orders record...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-white/40">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 px-6 font-bold text-luxury-gold">
                            {order.order_id || `#ORD-${order.id}`}
                          </td>
                          <td className="py-4 px-6 text-white/60">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-bold text-white text-sm">{order.customer_name}</p>
                            <p className="text-[10px] text-white/50">{order.phone} | Pincode: {order.pincode}</p>
                            <p className="text-[10px] text-white/40 max-w-xs truncate">{order.address}</p>
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-white">
                            ₹{order.total_amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm bg-black/60 border ${order.status === 'Pending'
                                ? 'border-yellow-500/40 text-yellow-400'
                                : order.status === 'Processing'
                                  ? 'border-blue-500/40 text-blue-400'
                                  : order.status === 'Shipped'
                                    ? 'border-purple-500/40 text-purple-400'
                                    : order.status === 'Delivered'
                                      ? 'border-green-500/40 text-green-400'
                                      : 'border-red-500/40 text-red-400'
                                } focus:outline-none cursor-pointer`}
                            >
                              <option value="Pending" className="bg-luxury-black text-yellow-400">Pending</option>
                              <option value="Processing" className="bg-luxury-black text-blue-400">Processing</option>
                              <option value="Shipped" className="bg-luxury-black text-purple-400">Shipped</option>
                              <option value="Delivered" className="bg-luxury-black text-green-400">Delivered</option>
                              <option value="Cancelled" className="bg-luxury-black text-red-400">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleViewOrderDetails(order)}
                              className="px-3.5 py-1.5 rounded-sm bg-white/5 hover:bg-luxury-gold/25 border border-white/10 hover:border-luxury-gold/50 text-white/60 hover:text-luxury-gold font-body text-[10px] uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="block md:hidden divide-y divide-white/[0.04] p-4 space-y-4">
                {ordersLoading ? (
                  <div className="py-8 text-center text-white/40">
                    <svg className="animate-spin h-5 w-5 text-luxury-gold mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs">Loading orders record...</span>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <p className="py-8 text-center text-white/40 font-body text-xs">No orders found.</p>
                ) : (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="pt-4 first:pt-0 flex flex-col gap-3 font-body text-xs text-white/80">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-luxury-gold">{order.order_id || `#ORD-${order.id}`}</span>
                        <span className="text-[10px] text-white/40">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div className="bg-black/20 p-3 rounded-sm border border-white/[0.03] space-y-2">
                        <div>
                          <p className="font-bold text-white text-sm">{order.customer_name}</p>
                          <p className="text-[10px] text-white/50 mt-0.5">{order.phone} | Pincode: {order.pincode}</p>
                          <p className="text-[10px] text-white/45 truncate mt-1">{order.address}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2 gap-2 flex-wrap">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-white/40 uppercase">Total Amount</span>
                            <span className="font-bold text-white text-sm">₹{order.total_amount.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] text-white/40 uppercase mb-1">Status</span>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-sm bg-black/60 border ${order.status === 'Pending' ? 'border-yellow-500/40 text-yellow-400' :
                                order.status === 'Processing' ? 'border-blue-500/40 text-blue-400' :
                                  order.status === 'Shipped' ? 'border-purple-500/40 text-purple-400' :
                                    order.status === 'Delivered' ? 'border-green-500/40 text-green-400' :
                                      'border-red-500/40 text-red-400'
                                } focus:outline-none cursor-pointer`}
                            >
                              <option value="Pending" className="bg-luxury-black text-yellow-400">Pending</option>
                              <option value="Processing" className="bg-luxury-black text-blue-400">Processing</option>
                              <option value="Shipped" className="bg-luxury-black text-purple-400">Shipped</option>
                              <option value="Delivered" className="bg-luxury-black text-green-400">Delivered</option>
                              <option value="Cancelled" className="bg-luxury-black text-red-400">Cancelled</option>
                            </select>
                          </div>
                          <button
                            onClick={() => handleViewOrderDetails(order)}
                            className="px-2.5 py-1.5 rounded-sm bg-white/5 hover:bg-luxury-gold/25 border border-white/10 flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold text-white/70"
                          >
                            <Eye className="w-3 h-3" />
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Newsletter Subscribers Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white mb-1.5">
                  Newsletter <span className="gold-gradient-text">Subscribers</span>
                </h1>
                <p className="text-sm text-white/40 font-body">Manage customer subscriptions and promotional coupon allocations</p>
              </div>
              <button
                onClick={fetchSubscribers}
                className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-luxury-gold/30 rounded-sm bg-white/[0.02] text-white/60 hover:text-luxury-gold transition-all duration-300 font-body text-xs font-semibold tracking-wider uppercase"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Subscribers
              </button>
            </div>

            {/* Subscribers Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="glass-card p-5 rounded-sm border border-luxury-gold/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-white/45 tracking-wider font-semibold mb-1">Total Subscribers</p>
                  <h3 className="font-heading text-2xl font-bold text-white">{totalSubscribers}</h3>
                </div>
                <div className="w-10 h-10 rounded-sm bg-white/[0.03] border border-white/10 flex items-center justify-center text-luxury-gold">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
              <div className="glass-card p-5 rounded-sm border border-luxury-gold/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-white/45 tracking-wider font-semibold mb-1">Active Coupons Issued</p>
                  <h3 className="font-heading text-2xl font-bold text-luxury-gold">{totalSubscribers}</h3>
                </div>
                <div className="w-10 h-10 rounded-sm bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                  <Tag className="w-5 h-5" />
                </div>
              </div>
            </section>

            {/* Subscribers Filter & Search */}
            <section className="flex flex-col sm:flex-row items-center gap-4 bg-white/[0.01] border border-white/[0.06] p-4 rounded-sm">
              <div className="relative w-full">
                <Search className="absolute inset-y-0 left-3.5 my-auto w-4.5 h-4.5 text-white/35" />
                <input
                  type="text"
                  placeholder="Search subscribers by email address or coupon code..."
                  value={subscriberSearchQuery}
                  onChange={(e) => setSubscriberSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 pl-11 pr-4 text-white font-body text-xs placeholder:text-white/20 focus:outline-none focus:border-luxury-gold transition-colors duration-300"
                />
              </div>
            </section>

            {/* Subscribers List Table / Cards */}
            <section className="glass-card rounded-sm overflow-hidden border border-white/[0.06] shadow-luxury">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-luxury-gold/15 bg-black/40 text-[10px] uppercase font-bold text-luxury-gold tracking-wider">
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Coupon Code</th>
                      <th className="py-4 px-6">Created Date</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] font-body text-xs text-white/80">
                    {subscribersLoading ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-white/40">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="animate-spin h-5 w-5 text-luxury-gold mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading subscribers record...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-white/40">
                          No newsletter subscribers found.
                        </td>
                      </tr>
                    ) : (
                      filteredSubscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 px-6 font-bold text-white flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-luxury-gold shrink-0">
                              <Mail className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate">{sub.email}</span>
                          </td>
                          <td className="py-4 px-6">
                            {(sub.coupon || sub.coupon_code) ? (
                              <span className="px-2.5 py-1 rounded-sm bg-luxury-gold/10 border border-luxury-gold/25 text-luxury-gold font-mono text-[11px] font-bold tracking-wider">
                                {sub.coupon || sub.coupon_code}
                              </span>
                            ) : (
                              <span className="text-white/30 italic">No Coupon</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-white/60">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => {
                                setCurrentSubscriber(sub);
                                setIsDeleteSubscriberModalOpen(true);
                              }}
                              className="w-8 h-8 rounded-sm bg-white/5 hover:bg-red-950 border border-white/10 hover:border-red-900/50 flex items-center justify-center text-white/60 hover:text-red-400 transition-all mx-auto"
                              title="Delete Subscriber"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="block md:hidden divide-y divide-white/[0.04] p-4 space-y-4">
                {subscribersLoading ? (
                  <div className="py-8 text-center text-white/40">
                    <svg className="animate-spin h-5 w-5 text-luxury-gold mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs">Loading subscribers record...</span>
                  </div>
                ) : filteredSubscribers.length === 0 ? (
                  <p className="py-8 text-center text-white/40 font-body text-xs">No newsletter subscribers found.</p>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <div key={sub.id} className="pt-4 first:pt-0 flex flex-col gap-3 font-body text-xs text-white/80">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-luxury-gold shrink-0">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-white truncate">{sub.email}</span>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentSubscriber(sub);
                            setIsDeleteSubscriberModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-sm bg-white/5 hover:bg-red-950 border border-white/10 flex items-center justify-center text-white/60 hover:text-red-400 shrink-0"
                          title="Delete Subscriber"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="bg-black/20 p-3 rounded-sm border border-white/[0.03] flex justify-between items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-white/40 uppercase">Coupon Code</span>
                          {(sub.coupon || sub.coupon_code) ? (
                            <span className="px-2 py-0.5 rounded-sm bg-luxury-gold/10 border border-luxury-gold/25 text-luxury-gold font-mono text-[10px] font-bold">
                              {sub.coupon || sub.coupon_code}
                            </span>
                          ) : (
                            <span className="text-white/30 italic text-[10px]">No Coupon</span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[9px] text-white/40 uppercase">Created Date</span>
                          <span className="text-[10px] text-white/70">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: '2-digit'
                            }) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ── Form Modal (Add / Edit Product) ── */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitLoading && setIsFormModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-luxury-black border border-luxury-gold/25 rounded-md p-6 md:p-8 relative z-10 shadow-luxury overflow-y-auto max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <h2 className="font-heading text-2xl font-bold text-white">
                  {currentProduct ? 'Edit' : 'Add New'} <span className="gold-gradient-text">Product</span>
                </h2>
                <button
                  onClick={() => !submitLoading && setIsFormModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  disabled={submitLoading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className={`w-full bg-black/40 border ${formErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-luxury-gold'
                        } rounded-sm py-3 px-4 text-white font-body text-sm focus:outline-none transition-colors`}
                      placeholder="e.g. Deluxe Sky Show 120 Shot"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-[10px] text-red-400 font-body">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider mb-2">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-sm py-3 px-4 text-white font-body text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                    >
                      {categoriesList.map(cat => (
                        <option key={cat} value={cat} className="bg-luxury-black">{cat}</option>
                      ))}
                      <option value="Other" className="bg-luxury-black">Other (Custom Category)</option>
                    </select>
                  </div>

                  {/* Custom Category Input */}
                  {formCategory === 'Other' && (
                    <div>
                      <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider mb-2">
                        Custom Category Name *
                      </label>
                      <input
                        type="text"
                        value={formCustomCategory}
                        onChange={(e) => setFormCustomCategory(e.target.value)}
                        className={`w-full bg-black/40 border ${formErrors.category ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-luxury-gold'
                          } rounded-sm py-3 px-4 text-white font-body text-sm focus:outline-none transition-colors`}
                        placeholder="Enter category name"
                      />
                      {formErrors.category && (
                        <p className="mt-1 text-[10px] text-red-400 font-body">{formErrors.category}</p>
                      )}
                    </div>
                  )}

                  {/* Sale Price */}
                  <div>
                    <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider mb-2">
                      Sale Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className={`w-full bg-black/40 border ${formErrors.price ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-luxury-gold'
                        } rounded-sm py-3 px-4 text-white font-body text-sm focus:outline-none transition-colors`}
                      placeholder="Discounted price"
                    />
                    {formErrors.price && (
                      <p className="mt-1 text-[10px] text-red-400 font-body">{formErrors.price}</p>
                    )}
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider mb-2">
                      Original Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(e.target.value)}
                      className={`w-full bg-black/40 border ${formErrors.originalPrice ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-luxury-gold'
                        } rounded-sm py-3 px-4 text-white font-body text-sm focus:outline-none transition-colors`}
                      placeholder="Retail price"
                    />
                    {formErrors.originalPrice && (
                      <p className="mt-1 text-[10px] text-red-400 font-body">{formErrors.originalPrice}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider mb-2">
                      Available Stock Qty *
                    </label>
                    <input
                      type="number"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className={`w-full bg-black/40 border ${formErrors.stock ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-luxury-gold'
                        } rounded-sm py-3 px-4 text-white font-body text-sm focus:outline-none transition-colors`}
                      placeholder="Stock quantity"
                    />
                    {formErrors.stock && (
                      <p className="mt-1 text-[10px] text-red-400 font-body">{formErrors.stock}</p>
                    )}
                  </div>

                  {/* Badge Select */}
                  <div>
                    <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider mb-2">
                      Promotional Badge
                    </label>
                    <select
                      value={formBadge}
                      onChange={(e) => {
                        const selected = e.target.value;
                        setFormBadge(selected);
                        const match = badgesList.find(b => b.value === selected);
                        if (match && match.color) setFormBadgeColor(match.color);
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-sm py-3 px-4 text-white font-body text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                    >
                      {badgesList.map(b => (
                        <option key={b.label} value={b.value} className="bg-luxury-black">{b.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Badge Color (visible if badge is set) */}
                  {formBadge && (
                    <div>
                      <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider mb-2">
                        Badge Hex Color
                      </label>
                      <div className="flex gap-2.5">
                        <input
                          type="color"
                          value={formBadgeColor}
                          onChange={(e) => setFormBadgeColor(e.target.value)}
                          className="w-12 h-11 bg-transparent border border-white/10 rounded-sm p-1 cursor-pointer focus:outline-none"
                        />
                        <input
                          type="text"
                          value={formBadgeColor}
                          onChange={(e) => setFormBadgeColor(e.target.value)}
                          className="flex-1 bg-black/40 border border-white/10 rounded-sm py-3 px-4 text-white font-body text-sm focus:outline-none focus:border-luxury-gold uppercase"
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      rows={3}
                      className={`w-full bg-black/40 border ${formErrors.description ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-luxury-gold'
                        } rounded-sm py-3 px-4 text-white font-body text-sm focus:outline-none transition-colors resize-none`}
                      placeholder="Describe the cracker burn effects, duration, and safety features..."
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-[10px] text-red-400 font-body">{formErrors.description}</p>
                    )}
                  </div>

                  {/* Image Input Container */}
                  <div className="md:col-span-2 border-t border-white/5 pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider">
                        Product Image Asset *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setUseUrlInsteadOfFile(!useUrlInsteadOfFile);
                          setFormErrors(prev => {
                            const copy = { ...prev };
                            delete copy.image;
                            return copy;
                          });
                        }}
                        className="text-[10px] text-luxury-gold hover:underline uppercase font-bold tracking-wider"
                      >
                        {useUrlInsteadOfFile ? 'Switch to Upload Image' : 'Switch to Image URL Link'}
                      </button>
                    </div>

                    {useUrlInsteadOfFile ? (
                      /* URL input */
                      <div>
                        <input
                          type="url"
                          value={imageUrlInput}
                          onChange={(e) => {
                            setImageUrlInput(e.target.value);
                            setImagePreview(e.target.value);
                          }}
                          className={`w-full bg-black/40 border ${formErrors.image ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-luxury-gold'
                            } rounded-sm py-3 px-4 text-white font-body text-sm focus:outline-none transition-colors`}
                          placeholder="https://example.com/image.jpg"
                        />
                        <p className="mt-1.5 text-[9px] text-white/30">Provide any public image hotlink URL directly.</p>
                      </div>
                    ) : (
                      /* Drag & Drop File upload */
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="relative flex-1 w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 hover:border-luxury-gold/50 rounded-sm cursor-pointer bg-black/40 hover:bg-black/60 transition-all p-4 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <Upload className="w-6 h-6 text-white/40 mb-2 group-hover:text-luxury-gold" />
                              <p className="font-body text-xs font-semibold text-white/70">
                                {imageFile ? imageFile.name : 'Click to Upload Product Image'}
                              </p>
                              <p className="font-body text-[9px] text-white/35 mt-1">
                                JPG, JPEG, PNG or WEBP (Max 5MB)
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageFileChange}
                              disabled={submitLoading}
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    {formErrors.image && (
                      <p className="mt-2 text-[10px] text-red-400 font-body">{formErrors.image}</p>
                    )}

                    {/* Image Preview Window */}
                    {imagePreview && (
                      <div className="mt-4 flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] p-3 rounded-sm">
                        <div className="relative w-20 h-20 shrink-0 border border-white/10 bg-black/60 rounded-sm overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=100&q=80';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-xs text-white/80 font-semibold truncate">Asset Preview</p>
                          <p className="font-body text-[10px] text-white/30 truncate">{useUrlInsteadOfFile ? imagePreview : imageFile?.name || 'Local file'}</p>
                          {useUrlInsteadOfFile && (
                            <a href={imagePreview} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-luxury-gold hover:underline mt-1">
                              Verify Link <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            setImageUrlInput('');
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-950 text-white/40 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-6 mt-6">
                  <button
                    type="button"
                    onClick={() => !submitLoading && setIsFormModalOpen(false)}
                    className="px-5 py-3 border border-white/10 hover:border-white/20 text-white/60 hover:text-white rounded-sm font-body text-xs font-semibold uppercase tracking-wider transition-all"
                    disabled={submitLoading}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitLoading}
                    className="px-6 py-3 bg-luxury-gold text-luxury-black font-body text-xs font-bold tracking-wider uppercase rounded-sm shadow-gold hover:bg-luxury-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitLoading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-luxury-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving changes...
                      </>
                    ) : (
                      currentProduct ? 'Save Changes' : 'Create Product'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {isDeleteModalOpen && currentProduct && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitLoading && setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-luxury-black border border-red-900/30 rounded-md p-6 relative z-10 shadow-luxury"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-950/30 border border-red-900/40 flex items-center justify-center mx-auto mb-4 text-red-500 animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">Confirm Delete</h3>
                <p className="font-body text-xs text-white/50 mb-6 leading-relaxed">
                  Are you sure you want to delete <b className="text-white">"{currentProduct.name}"</b>?
                  This will permanently remove the item from the catalog database and delete its associated image asset from storage. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => !submitLoading && setIsDeleteModalOpen(false)}
                  className="px-4 py-3 border border-white/10 hover:border-white/20 text-white/60 hover:text-white rounded-sm font-body text-xs font-semibold uppercase tracking-wider transition-colors"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={submitLoading}
                  className="px-5 py-3 bg-red-650 hover:bg-red-700 bg-red-900 border border-red-800 text-white rounded-sm font-body text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Subscriber Confirmation Modal ── */}
      <AnimatePresence>
        {isDeleteSubscriberModalOpen && currentSubscriber && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitLoading && setIsDeleteSubscriberModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-luxury-black border border-red-900/30 rounded-md p-6 relative z-10 shadow-luxury"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-950/30 border border-red-900/40 flex items-center justify-center mx-auto mb-4 text-red-500 animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">Delete Subscriber</h3>
                <p className="font-body text-xs text-white/50 mb-6 leading-relaxed">
                  Are you sure you want to remove <b className="text-white">"{currentSubscriber.email}"</b> from newsletter subscribers?
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => !submitLoading && setIsDeleteSubscriberModalOpen(false)}
                  className="px-4 py-3 border border-white/10 hover:border-white/20 text-white/60 hover:text-white rounded-sm font-body text-xs font-semibold uppercase tracking-wider transition-colors"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubscriberConfirm}
                  disabled={submitLoading}
                  className="px-5 py-3 bg-red-900 border border-red-800 text-white rounded-sm font-body text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Order Details Modal ── */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-luxury-black border border-luxury-gold/25 rounded-md p-6 relative z-10 shadow-luxury overflow-y-auto max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-5">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-luxury-gold" />
                    Order Invoice Details
                  </h3>
                  <p className="text-[10px] text-luxury-gold uppercase tracking-widest font-semibold mt-0.5">{selectedOrder.order_id || `#ORD-${selectedOrder.id}`}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Order Info & Customer Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-xs text-white/70">
                {/* ORDER INFORMATION */}
                <div className="bg-white/[0.015] border border-white/[0.05] p-4 rounded-sm flex flex-col gap-2">
                  <p className="text-luxury-gold uppercase text-[10px] tracking-wider font-bold border-b border-white/5 pb-1.5 mb-1">
                    Order Information
                  </p>
                  <p><span className="text-white/40">Order ID:</span> <span className="font-mono font-bold text-white">{selectedOrder.order_id || `#ORD-${selectedOrder.id}`}</span></p>
                  <p><span className="text-white/40">Order Date & Time:</span> <span className="text-white">{new Date(selectedOrder.created_at).toLocaleString('en-IN')}</span></p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-white/40">Current Status:</span>
                    <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-sm ${selectedOrder.status === 'Pending' ? 'bg-yellow-950/20 text-yellow-400 border border-yellow-900/30' :
                      selectedOrder.status === 'Processing' ? 'bg-blue-950/20 text-blue-400 border border-blue-900/30' :
                        selectedOrder.status === 'Shipped' ? 'bg-purple-950/20 text-purple-400 border border-purple-900/30' :
                          selectedOrder.status === 'Delivered' ? 'bg-green-950/20 text-green-400 border border-green-900/30' :
                            'bg-red-950/20 text-red-400 border border-red-900/30'
                      }`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p><span className="text-white/40">Payment Method:</span> <span className="font-semibold text-white">{selectedOrder.payment_method}</span></p>
                </div>

                {/* CUSTOMER DETAILS */}
                <div className="bg-white/[0.015] border border-white/[0.05] p-4 rounded-sm flex flex-col gap-2">
                  <p className="text-luxury-gold uppercase text-[10px] tracking-wider font-bold border-b border-white/5 pb-1.5 mb-1">
                    Customer & Delivery Details
                  </p>
                  <p className="text-white font-bold text-sm">{selectedOrder.customer_name}</p>
                  <p className="font-semibold text-luxury-gold">Phone: {selectedOrder.phone}</p>
                  <p>City: <span className="font-bold text-white">{selectedOrder.city || 'N/A'}</span> | Pincode: <span className="font-bold text-white">{selectedOrder.pincode}</span></p>
                  {selectedOrder.landmark && (
                    <p>Landmark: <span className="italic text-white/90">{selectedOrder.landmark}</span></p>
                  )}
                  {selectedOrder.delivery_date && (
                    <p className="text-yellow-400">
                      Preferred Date: <span className="font-semibold">{new Date(selectedOrder.delivery_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </p>
                  )}
                  <div className="border-t border-white/5 pt-1.5 mt-0.5">
                    <p className="text-white/40 text-[9px] uppercase tracking-wider font-bold mb-0.5">Delivery Address</p>
                    <p className="text-white/80 leading-relaxed italic break-words" title={selectedOrder.address}>{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div className="border border-white/[0.06] rounded-sm overflow-hidden mb-5">
                <div className="bg-white/[0.02] border-b border-white/[0.08] px-4 py-2 text-[10px] uppercase font-bold text-luxury-gold tracking-wider">
                  Order Items
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-black/20 text-[9px] uppercase font-bold text-white/45 tracking-wider">
                      <th className="py-2.5 px-4">Product Name</th>
                      <th className="py-2.5 px-4 text-center">Quantity</th>
                      <th className="py-2.5 px-4 text-center">Unit Price</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-white/80 font-mono">
                    {itemsLoading ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center">
                          <svg className="animate-spin h-4 w-4 text-luxury-gold mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </td>
                      </tr>
                    ) : orderItemsList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-white/45 font-body">
                          No items records found in order details.
                        </td>
                      </tr>
                    ) : (
                      orderItemsList.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="py-2.5 px-4 font-body font-bold text-white">
                            {item.name || item.product_name}
                          </td>
                          <td className="py-2.5 px-4 text-center text-luxury-gold">
                            {item.qty}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            ₹{item.price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-4 text-right text-white">
                            ₹{(item.price * item.qty).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAYMENT SUMMARY */}
              <div className="flex justify-between items-center bg-white/[0.015] border border-white/[0.05] p-3.5 rounded-sm mb-5 font-semibold text-xs text-white/70">
                <span className="text-white/40 uppercase text-[9px] tracking-wider font-bold">Payment Summary (Grand Total)</span>
                <span className="text-base font-mono font-bold text-luxury-gold">₹{selectedOrder.total_amount.toLocaleString('en-IN')}</span>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold hover:text-white rounded-sm font-body text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Print Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-luxury-gold hover:bg-luxury-gold-light text-luxury-black font-body text-xs font-bold uppercase tracking-wider rounded-sm transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

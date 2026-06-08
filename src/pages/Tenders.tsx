import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Lock,
  Package,
  Plus,
  Search,
  Send,
  ShieldCheck,
  ChevronDown,
  Check,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "../lib/utils";

import AdSpace from "../components/AdSpace";
import { TenderSkeleton } from "../components/Skeleton";

interface Tender {
  id: string;
  title: string;
  description: string;
  budget: number | string;
  deadline: string;
  status: string;
  category: string;
  author: { name: string; company: string };
  type?: string;
  responses?: number;
}

const Tenders = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<"list" | "create">("list");
  const [selectedType, setSelectedType] = useState("Tous");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tenders, setTenders] = useState<Tender[]>([]);

  const tenderCategories = [
    "Tous",
    "Énergie",
    "Mécanique",
    "BTP",
    "Agroalimentaire",
    "Services",
  ];
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio < 1) {
            if (entry.target === categoryRef.current) setIsCategoryOpen(false);
          }
        });
      },
      { threshold: 1 },
    );

    const currentCategoryRef = categoryRef.current;
    if (currentCategoryRef) observer.observe(currentCategoryRef);

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      observer.disconnect();
    };
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    productName: searchParams.get("product") || "",
    quantity: "",
    deadline: "",
    description: "",
    priority: "Normal",
  });

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/tenders").catch(() => null);
        let data = [
          {
            id: "1",
            reference_id: "TND-B82XQL",
            title: "Fourniture de pompes centrifuges",
            category: "Équipement",
            author: { name: "Ahmed", company: "Sonatrach SPA" },
            deadline: "2026-07-20",
            status: "open",
            description:
              "Demande de fourniture pour 10 pompes centrifuges industrielles haut débit.",
          },
          {
            id: "2",
            reference_id: "TND-9C4M1V",
            title: "Installation de système anti-incendie",
            category: "Sécurité",
            author: { name: "Karim", company: "Cosider Construction" },
            deadline: "2026-06-15",
            status: "Urgent",
            description:
              "Installation système de sécurité incendie complet pour le nouveau hangar industriel.",
          },
        ];

        if (res && res.ok) {
          data = await res.json();
        }

        const formattedData = data.map((t: any) => ({
          ...t,
          type: t.category === "Public" ? "Public" : "Privé", // Simulating type from category for now
          responses: Math.floor(Math.random() * 20), // Mock responses format
          formattedDeadline: new Date(t.deadline).toLocaleDateString(),
        }));
        setTenders(formattedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTenders();
  }, []);

  useEffect(() => {
    const product = searchParams.get("product");
    const rfqParam = searchParams.get("rfq");
    if (product) {
      setFormData((prev) => ({ ...prev, productName: product }));
      setView("create");
    }
    if (rfqParam === "true") {
      setView("create");
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <div
        className={cn(
          "min-h-[80vh] flex items-center justify-center bg-neutral-bg px-4",
          i18n.language === "ar" && "font-arabic",
        )}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white border border-gray-200 p-12 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-3xl font-black text-primary uppercase tracking-tighter leading-tight mb-4">
            {t("rfq.success_title")}
          </h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed mb-8">
            {t("rfq.success_text")}
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setView("list");
            }}
            className="btn-primary w-full"
          >
            Retour aux Appels d'Offres
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-neutral-bg min-h-screen pb-20",
        i18n.language === "ar" && "font-arabic",
      )}
    >
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="h-6 w-6 text-secondary" />
                <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">
                  {view === "list" ? "Appels d'Offres" : "Nouvelle Demande"}
                </h1>
              </div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                {view === "list"
                  ? "Découvrez et répondez aux opportunités d'affaires du secteur industriel."
                  : "Soumettez votre besoin technique pour recevoir des offres comparatives."}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {view === "create" && (
                <button
                  onClick={() => setView("list")}
                  className="flex items-center space-x-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Annuler</span>
                </button>
              )}
              <button
                onClick={() => setView(view === "list" ? "create" : "list")}
                className={cn(
                  "flex items-center space-x-2 py-3 px-6 shadow-xl transition-all duration-300 rounded-none font-black text-[10px] uppercase tracking-widest",
                  view === "list"
                    ? "bg-secondary text-white shadow-secondary/20 hover:scale-105"
                    : "bg-primary text-white hover:bg-secondary",
                )}
              >
                {view === "list" ? (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Demander Appel d'Offre</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Voir les opportunités</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {view === "list" && (
            <div className="flex flex-col md:flex-row items-center gap-4 mt-8">
              <div className="flex bg-neutral-bg p-1 border border-gray-100 flex-shrink-0">
                {["Tous", "Public", "Privé"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                      selectedType === type
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-500 hover:text-primary",
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex gap-4 w-full">
                <div className="flex-1 flex items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <Search className="h-5 w-5 text-gray-400 ml-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un appel d'offre..."
                    className="flex-1 bg-transparent px-4 py-2 text-sm font-medium focus:outline-none"
                  />
                  <button
                    className="px-6 py-2 bg-primary rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-secondary transition-all"
                    type="button"
                  >
                    Rechercher
                  </button>
                </div>

                <div className="relative shrink-0" ref={categoryRef}>
                  <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full sm:w-auto flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-gray-800 hover:border-gray-300 min-w-[240px] text-left"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider truncate">
                      {selectedCategory === "Tous"
                        ? "Toutes les catégories"
                        : selectedCategory}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-gray-400 transition-transform ml-4 shrink-0",
                        isCategoryOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 max-h-64 overflow-y-auto overflow-x-hidden transform origin-top animate-in fade-in slide-in-from-top-2 duration-200">
                      {tenderCategories.map((cat) => (
                        <button
                          key={cat}
                          className={cn(
                            "w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-between group",
                            selectedCategory === cat
                              ? "text-primary bg-primary/5"
                              : "text-gray-600",
                          )}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setIsCategoryOpen(false);
                          }}
                        >
                          <span
                            className={cn(
                              selectedCategory === cat
                                ? ""
                                : "group-hover:translate-x-1 transition-transform",
                            )}
                          >
                            {cat === "Tous" ? "Toutes les catégories" : cat}
                          </span>
                          {selectedCategory === cat && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <AnimatePresence mode="wait">
          {view === "list" ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Main List */}
              <div className="lg:col-span-2 space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <TenderSkeleton key={i} />
                    ))}
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-500 p-8 border border-red-100 font-bold">
                    {error}
                  </div>
                ) : tenders.length === 0 ? (
                  <div className="bg-white p-8 text-center border border-gray-200">
                    <p className="text-gray-500 font-bold uppercase">
                      Aucun appel d'offre trouvé.
                    </p>
                  </div>
                ) : (
                  tenders
                    .filter(
                      (t) => selectedType === "Tous" || t.type === selectedType,
                    )
                    .filter(
                      (t) =>
                        selectedCategory === "Tous" ||
                        t.category === selectedCategory ||
                        (t.category &&
                          t.category.toLowerCase() ===
                            selectedCategory.toLowerCase()),
                    )
                    .filter((t) => {
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return (
                        t.title?.toLowerCase().includes(query) ||
                        t.description?.toLowerCase().includes(query) ||
                        (t.author?.company &&
                          t.author.company.toLowerCase().includes(query)) ||
                        t.id?.toLowerCase().includes(query) ||
                        t.reference_id?.toLowerCase().includes(query)
                      );
                    })
                    .map((tender, index) => (
                      <motion.div
                        key={tender.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={`/tenders/${tender.id}`}
                          className="block bg-white p-8 rounded-none border border-gray-200 shadow-sm hover:shadow-xl transition-all group"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-4">
                                <span
                                  className={cn(
                                    "px-3 py-1 text-[9px] font-black uppercase tracking-widest flex items-center space-x-1.5",
                                    tender.type === "Public"
                                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                                      : "bg-purple-50 text-purple-600 border border-purple-100",
                                  )}
                                >
                                  {tender.type === "Public" ? (
                                    <Globe className="h-3 w-3" />
                                  ) : (
                                    <Lock className="h-3 w-3" />
                                  )}
                                  <span>{tender.type}</span>
                                </span>
                                <span
                                  className={cn(
                                    "px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
                                    tender.status === "open"
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      : "bg-orange-50 text-orange-600 border-orange-100",
                                  )}
                                >
                                  {tender.status === "open"
                                    ? "Ouvert"
                                    : tender.status}
                                </span>
                              </div>
                              <h3 className="text-2xl font-black text-primary group-hover:text-secondary transition-colors mb-2 uppercase tracking-tighter leading-tight">
                                {tender.title}
                              </h3>
                              {tender.reference_id && (
                                <p className="text-[10px] font-mono text-gray-400 mb-4 tracking-wider">
                                  REF: {tender.reference_id}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6">
                                <div className="flex items-center space-x-2">
                                  <Building2 className="h-4 w-4 text-secondary" />
                                  <span className="text-primary">
                                    {tender.author?.company || "Anonyme"}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-secondary" />
                                  <span>{tender.category}</span>
                                </div>
                              </div>
                              <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
                                {tender.description}
                              </p>
                            </div>
                            <div className="sm:text-right flex flex-col justify-between items-end min-w-[200px]">
                              <div className="bg-neutral-bg p-4 border border-gray-100 mb-6 w-full">
                                <div className="flex items-center sm:justify-end space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                  <Calendar className="h-3.5 w-3.5 text-secondary" />
                                  <span>Date limite</span>
                                </div>
                                <p className="text-2xl font-black text-primary font-mono">
                                  {(tender as any).formattedDeadline ||
                                    tender.deadline}
                                </p>
                              </div>
                              <div className="btn-primary w-full sm:w-auto py-3 px-8 flex items-center justify-center space-x-3 group/btn text-center">
                                <span>Détails de l'appel d'offre</span>
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <div className="flex items-center space-x-6">
                              <span className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-secondary" />
                                <span>Publié récemment</span>
                              </span>
                              <span className="flex items-center space-x-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="text-primary">
                                  {tender.responses} réponses reçues
                                </span>
                              </span>
                            </div>
                            <span className="font-black text-secondary bg-secondary/5 px-3 py-1">
                              Budget: {tender.budget} DA
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                )}
              </div>

              {/* Sidebar Info */}
              <aside className="space-y-6">
                <div className="bg-primary p-10 text-white relative overflow-hidden border-l-4 border-secondary shadow-2xl">
                  <div className="absolute -right-8 -bottom-8 opacity-5">
                    <FileText className="h-48 w-48" />
                  </div>
                  <h3 className="text-2xl font-black mb-6 relative z-10 uppercase tracking-tighter">
                    Compte Premium
                  </h3>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-8 relative z-10 leading-relaxed">
                    Accédez aux appels d'offres privés et recevez des alertes
                    personnalisées dès qu'une opportunité correspond à votre
                    secteur.
                  </p>
                  <Link
                    to="/subscriptions"
                    className="w-full bg-white text-primary font-black py-4 text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all relative z-10 flex items-center justify-center"
                  >
                    Devenir Premium
                  </Link>
                </div>

                <div className="bg-white p-8 border border-gray-200">
                  <h4 className="font-black text-primary mb-6 flex items-center space-x-3 text-xs uppercase tracking-widest">
                    <AlertCircle className="h-5 w-5 text-secondary" />
                    <span>Conseils de réponse</span>
                  </h4>
                  <ul className="space-y-6">
                    {[
                      "Vérifiez bien les critères d'éligibilité avant de répondre.",
                      "Préparez votre devis au format PDF pour un dépôt rapide.",
                      "Mettez en avant vos certifications ISO pour rassurer l'acheteur.",
                    ].map((text, i) => (
                      <li
                        key={i}
                        className="flex items-start space-x-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-relaxed"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-1 flex-shrink-0" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <AdSpace
                  type="vertical"
                  title="Logiciel ERP"
                  description="Optimisez votre production."
                  imageUrl="https://picsum.photos/seed/erp/400/600"
                />
              </aside>
            </motion.div>
          ) : (
            <motion.div
              key="create-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 p-10 shadow-xl">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Company Info */}
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
                        <Building2 className="h-6 w-6 text-secondary" />
                        <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">
                          SOCIÉTÉ & CONTACT
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            NOM DE L'ENTREPRISE
                          </label>
                          <input
                            required
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full bg-neutral-bg border border-gray-200 px-5 py-4 text-xs font-bold outline-none focus:border-secondary transition-all uppercase tracking-wider"
                            placeholder="EX: SONATRACH"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            VOTRE NOM COMPLET
                          </label>
                          <input
                            required
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleChange}
                            className="w-full bg-neutral-bg border border-gray-200 px-5 py-4 text-xs font-bold outline-none focus:border-secondary transition-all uppercase tracking-wider"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            EMAIL PROFESSIONNEL
                          </label>
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-neutral-bg border border-gray-200 px-5 py-4 text-xs font-bold outline-none focus:border-secondary transition-all tracking-wider"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            SECTEUR D'ACTIVITÉ
                          </label>
                          <select
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="w-full bg-neutral-bg border border-gray-200 px-5 py-4 text-xs font-bold outline-none focus:border-secondary transition-all uppercase tracking-wider appearance-none"
                          >
                            <option value="">SÉLECTIONNER...</option>
                            <option value="energie">ÉNERGIE</option>
                            <option value="mecanique">MÉCANIQUE</option>
                            <option value="btp">BTP</option>
                            <option value="agro">AGROALIMENTAIRE</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
                        <Package className="h-6 w-6 text-secondary" />
                        <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">
                          DÉTAILS DU BESOIN
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            PRODUIT OU ÉQUIPEMENT
                          </label>
                          <input
                            required
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className="w-full bg-neutral-bg border border-gray-200 px-5 py-4 text-xs font-bold outline-none focus:border-secondary transition-all uppercase tracking-wider"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            QUANTITÉ ESTIMÉE
                          </label>
                          <input
                            required
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full bg-neutral-bg border border-gray-200 px-5 py-4 text-xs font-bold outline-none focus:border-secondary transition-all uppercase tracking-wider"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          DESCRIPTION TECHNIQUE DÉTAILLÉE
                        </label>
                        <textarea
                          required
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={6}
                          className="w-full bg-neutral-bg border border-gray-200 px-5 py-4 text-xs font-bold outline-none focus:border-secondary transition-all uppercase tracking-wider resize-none"
                          placeholder="SPÉCIFICATIONS, DIMENSIONS, CERTIFICATIONS REQUISES..."
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full py-5 flex items-center justify-center space-x-4 group text-xs tracking-[0.2em]"
                    >
                      <Send className="h-5 w-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                      <span>ENVOYER LA DEMANDE DE COTATION</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* RFQ Sidebar */}
              <div className="space-y-8">
                <div className="bg-primary text-white p-10 border-l-8 border-secondary shadow-2xl">
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-8 italic">
                    Le Processus
                  </h3>
                  <div className="space-y-10">
                    {[
                      {
                        step: "01",
                        title: "SOUMISSION",
                        desc: "VOTRE DEMANDE EST ANALYSÉE PAR NOS EXPERTS TECHNIQUES.",
                      },
                      {
                        step: "02",
                        title: "SOURCING",
                        desc: "NOUS CONSULTONS LES MEILLEURS FOURNISSEURS QUALIFIÉS.",
                      },
                      {
                        step: "03",
                        title: "COTATION",
                        desc: "VOUS RECEVEZ PLUSIEURS OFFRES SOUS 48H.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start space-x-5 group">
                        <span className="text-3xl font-black font-mono text-secondary/30 group-hover:text-secondary/80 transition-colors leading-none">
                          {item.step}
                        </span>
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-widest mb-2">
                            {item.title}
                          </h4>
                          <p className="text-[9px] text-white/40 font-bold leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-10 shadow-sm">
                  <div className="flex items-center space-x-4 mb-8">
                    <ShieldCheck className="h-7 w-7 text-emerald-500" />
                    <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">
                      GARANTIES INDUSTRIE
                    </h3>
                  </div>
                  <ul className="space-y-6">
                    {[
                      "FOURNISSEURS VÉRIFIÉS",
                      "ASSISTANCE TECHNIQUE DÉDIÉE",
                      "TRANSPARENCE TOTALE",
                    ].map((text, i) => (
                      <li
                        key={i}
                        className="flex items-center space-x-4 text-[9px] font-black text-gray-500 uppercase tracking-widest"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tenders;

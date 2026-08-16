import React, { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

const BASE_URL = "https://syncsphere-hiv6.onrender.com"
const DEFAULT_ACCENT = "#4F46E5"

export interface Course {
    mangoId: string
    courseCode: string
    courseName: string
    description: string
    mainCategory: string
    courseType: string
    pricePaise: number
    priceUsdCents: number
    refundable: boolean
}

export interface Props {
    title?: string
    accentColor?: string
    defaultCurrency?: string
    cardRadius?: number
    showHero?: boolean
    showFooter?: boolean
    showSearch?: boolean
    showFilter?: boolean
    style?: React.CSSProperties
    className?: string
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number
}

function hexToRgba(hex: string, alpha: number = 1): string {
    const cleanHex = hex.replace("#", "")
    let r = 79,
        g = 70,
        b = 229
    if (cleanHex.length === 6) {
        r = parseInt(cleanHex.substring(0, 2), 16)
        g = parseInt(cleanHex.substring(2, 4), 16)
        b = parseInt(cleanHex.substring(4, 6), 16)
    } else if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16)
        g = parseInt(cleanHex[1] + cleanHex[1], 16)
        b = parseInt(cleanHex[2] + cleanHex[2], 16)
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function normalizeCourse(raw: any, index: number): Course {
    return {
        mangoId: String(raw.mangoId || raw._id || index),
        courseCode: String(raw.courseCode || raw.code || ""),
        courseName: String(
            raw.courseName ||
                raw.name ||
                raw.course_name ||
                raw.title ||
                "Course"
        ),
        description: String(raw.description || raw.desc || ""),
        mainCategory: String(
            raw.mainCategory || raw.category || raw.main_category || ""
        ),
        courseType: String(raw.courseType || raw.type || ""),
        pricePaise: Number(raw.pricePaise ?? raw.price_paise ?? 0),
        priceUsdCents: Number(raw.priceUsdCents ?? raw.price_usd_cents ?? 0),
        refundable: Boolean(raw.refundable ?? raw.is_refundable ?? false),
    }
}

function IconBase({ size = 24, children, style, ...rest }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={style}
            {...rest}
        >
            {children}
        </svg>
    )
}

function Search(props: IconProps) {
    return (
        <IconBase {...props}>
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </IconBase>
    )
}

function SearchX(props: IconProps) {
    return (
        <IconBase {...props}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="8" x2="14" y2="14" />
            <line x1="14" y1="8" x2="8" y2="14" />
        </IconBase>
    )
}

function Globe(props: IconProps) {
    return (
        <IconBase {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 0 20" />
            <path d="M12 2a15.3 15.3 0 0 0 0 20" />
        </IconBase>
    )
}

function Youtube(props: IconProps) {
    return (
        <IconBase {...props}>
            <rect x="3" y="6" width="18" height="12" rx="3" />
            <polygon
                points="10,9 16,12 10,15"
                fill="currentColor"
                stroke="none"
            />
        </IconBase>
    )
}

function Instagram(props: IconProps) {
    return (
        <IconBase {...props}>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
            />
        </IconBase>
    )
}

function Mic(props: IconProps) {
    return (
        <IconBase {...props}>
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <line x1="8" y1="21" x2="16" y2="21" />
        </IconBase>
    )
}

function FileText(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="15" y2="17" />
        </IconBase>
    )
}

function Briefcase(props: IconProps) {
    return (
        <IconBase {...props}>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            <path d="M3 12h18" />
        </IconBase>
    )
}

function Video(props: IconProps) {
    return (
        <IconBase {...props}>
            <rect x="3" y="6" width="13" height="12" rx="2" />
            <polygon
                points="16,10 21,7 21,17 16,14"
                fill="currentColor"
                stroke="none"
            />
        </IconBase>
    )
}

function GraduationCap(props: IconProps) {
    return (
        <IconBase {...props}>
            <polygon points="2,9 12,4 22,9 12,14" />
            <path d="M6 11v4c0 1.5 3 3 6 3s6-1.5 6-3v-4" />
        </IconBase>
    )
}

function Sparkles(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
            <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z" />
            <path d="M5 14l.6 1.4L7 16l-1.4.6L5 18l-.6-1.4L3 16l1.4-.6z" />
        </IconBase>
    )
}

function AlertTriangle(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
        </IconBase>
    )
}

function RefreshCw(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
        </IconBase>
    )
}

function ArrowRight(props: IconProps) {
    return (
        <IconBase {...props}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </IconBase>
    )
}

function Filter(props: IconProps) {
    return (
        <IconBase {...props}>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </IconBase>
    )
}

function ArrowUpDown(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
        </IconBase>
    )
}

function CheckCircle2(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </IconBase>
    )
}

function ChevronDown(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="m6 9 6 6 6-6" />
        </IconBase>
    )
}

function Command(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </IconBase>
    )
}

function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = 8000
): Promise<Response> {
    const controller = new AbortController()
    const parentSignal = options.signal

    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    if (parentSignal) {
        if (parentSignal.aborted) {
            controller.abort()
        } else {
            parentSignal.addEventListener("abort", () => controller.abort())
        }
    }

    return fetch(url, { ...options, signal: controller.signal }).finally(() =>
        clearTimeout(timeoutId)
    )
}

// Custom Select Component for Framer
function FramerCustomSelect({
    value,
    options = [],
    onChange,
    icon: IconComponent,
    accentColor = DEFAULT_ACCENT,
    ariaLabel = "Select option",
}: {
    value: string
    options: { value: string; label: string }[]
    onChange: (val: string) => void
    icon?: React.ComponentType<IconProps>
    accentColor?: string
    ariaLabel?: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const selectedOption =
        options.find((opt) => opt.value === value) || options[0]

    return (
        <div
            className="sp-select-container"
            style={{ position: "relative", minWidth: "140px" }}
            ref={containerRef}
        >
            <button
                type="button"
                className="sp-select-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={ariaLabel}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "2.25rem",
                    padding: "0 0.85rem",
                    borderRadius: "9999px",
                    border: "1px solid #e2e8f0",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: "clamp(0.775rem, 2vw, 0.825rem)",
                    fontWeight: 500,
                    cursor: "pointer",
                    outline: "none",
                    gap: "0.5rem",
                    transition: "border-color 0.15s ease",
                }}
            >
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    {IconComponent && (
                        <IconComponent
                            size={14}
                            style={{ color: "#475569" }}
                            aria-hidden="true"
                        />
                    )}
                    <span>{selectedOption?.label || "Select..."}</span>
                </span>
                <ChevronDown
                    size={14}
                    style={{
                        opacity: 0.7,
                        transform: isOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.15s ease",
                    }}
                />
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        padding: "4px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                        maxHeight: "220px",
                        overflowY: "auto",
                    }}
                >
                    {options.map((opt) => {
                        const isSelected = opt.value === value
                        return (
                            <div
                                key={opt.value}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                    onChange(opt.value)
                                    setIsOpen(false)
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "0.5rem 0.75rem",
                                    borderRadius: "8px",
                                    fontSize: "0.825rem",
                                    fontWeight: isSelected ? 600 : 400,
                                    background: isSelected
                                        ? accentColor
                                        : "transparent",
                                    color: isSelected ? "#ffffff" : "#0f172a",
                                    cursor: "pointer",
                                    transition: "background 0.15s ease",
                                }}
                            >
                                <span>{opt.label}</span>
                                {isSelected && (
                                    <CheckCircle2
                                        size={14}
                                        style={{ color: "#ffffff" }}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// Currency Switcher Component
function FramerCurrencyPillToggle({
    countryCode,
    onToggle,
    accentColor = DEFAULT_ACCENT,
}: {
    countryCode: string
    onToggle: () => void
    accentColor?: string
}) {
    const isUSD = countryCode === "US"
    const isINR = countryCode === "IN"

    return (
        <div
            className="sp-currency-toggle"
            role="radiogroup"
            aria-label="Select currency"
            style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "9999px",
                padding: "3px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                userSelect: "none",
            }}
        >
            <button
                type="button"
                role="radio"
                className="sp-currency-segment"
                aria-checked={isUSD}
                onClick={() => isINR && onToggle()}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                    padding: "0.35rem 0.85rem 0.35rem 0.45rem",
                    borderRadius: "9999px",
                    border: "none",
                    background: isUSD ? accentColor : "transparent",
                    color: isUSD ? "#ffffff" : "#64748b",
                    fontWeight: isUSD ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                    height: "2.25rem",
                }}
            >
                <span
                    style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: isUSD
                            ? "1px solid #ffffff"
                            : "1px solid #e2e8f0",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: isUSD ? 800 : 700,
                        background: isUSD ? "#ffffff" : "transparent",
                        color: isUSD ? accentColor : "#475569",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    $
                </span>
                <span style={{ fontSize: "0.825rem", letterSpacing: "0.02em" }}>
                    USD
                </span>
            </button>

            <button
                type="button"
                role="radio"
                className="sp-currency-segment"
                aria-checked={isINR}
                onClick={() => isUSD && onToggle()}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                    padding: "0.35rem 0.85rem 0.35rem 0.45rem",
                    borderRadius: "9999px",
                    border: "none",
                    background: isINR ? accentColor : "transparent",
                    color: isINR ? "#ffffff" : "#64748b",
                    fontWeight: isINR ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                    height: "2.25rem",
                }}
            >
                <span
                    style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: isINR
                            ? "1px solid #ffffff"
                            : "1px solid #e2e8f0",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: isINR ? 800 : 700,
                        background: isINR ? "#ffffff" : "transparent",
                        color: isINR ? accentColor : "#475569",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    ₹
                </span>
                <span style={{ fontSize: "0.825rem", letterSpacing: "0.02em" }}>
                    INR
                </span>
            </button>
        </div>
    )
}

export default function SkillpathCourses(props: Props) {
    const {
        title = "Available Courses",
        accentColor = DEFAULT_ACCENT,
        defaultCurrency = "",
        cardRadius = 22,
        showHero = true,
        showFooter = true,
        showSearch = true,
        showFilter = true,
        style,
        className = "",
        ...restProps
    } = props

    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const containerRef = useRef<HTMLDivElement>(null)
    const mainSectionRef = useRef<HTMLElement>(null)
    const [isInView, setIsInView] = useState<boolean>(true)
    const [courses, setCourses] = useState<Course[]>([])
    const [detectedCountry, setDetectedCountry] = useState<string>("IN")
    const [userCurrencyOverride, setUserCurrencyOverride] = useState<
        string | null
    >(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [sortBy, setSortBy] = useState<string>("default")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(
        null
    )

    // Effective country priority: User override > Property Control default > API detected country
    const effectiveCountryCode = useMemo(() => {
        if (userCurrencyOverride) return userCurrencyOverride.toUpperCase()
        if (defaultCurrency) return defaultCurrency.toUpperCase()
        return detectedCountry
    }, [userCurrencyOverride, defaultCurrency, detectedCountry])

    useEffect(() => {
        if (
            isCanvas ||
            !containerRef.current ||
            typeof IntersectionObserver === "undefined"
        )
            return
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.1 }
        )
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [isCanvas])

    const handleScrollToCourses = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault()
            const target =
                mainSectionRef.current ||
                document.getElementById("courses-section")
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        },
        []
    )

    const loadData = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true)
        setError(null)
        try {
            const [courseResult, countryResult] = await Promise.allSettled([
                fetchWithTimeout(`${BASE_URL}/assignment/course-data`, {
                    signal,
                }),
                fetchWithTimeout(`${BASE_URL}/assignment/country-code`, {
                    signal,
                }),
            ])

            if (signal?.aborted) return

            if (courseResult.status === "fulfilled" && courseResult.value.ok) {
                const data = await courseResult.value.json()
                const rawList = Array.isArray(data) ? data : data.courses || []
                const normalized = rawList.map((item: any, idx: number) =>
                    normalizeCourse(item, idx)
                )
                setCourses(normalized)
            } else {
                throw new Error("API Error: Failed to load course data.")
            }

            let country = "IN"
            if (
                countryResult.status === "fulfilled" &&
                countryResult.value.ok
            ) {
                const countryData = await countryResult.value.json()
                if (countryData && countryData.country_code) {
                    country = String(countryData.country_code).toUpperCase()
                }
            }

            if (!signal?.aborted) {
                setDetectedCountry(country)
            }
        } catch (err: any) {
            if (!signal?.aborted) {
                setError(err.message || "Failed to load course data.")
            }
        } finally {
            if (!signal?.aborted) {
                setIsLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        loadData(controller.signal)
        return () => {
            controller.abort()
        }
    }, [loadData])

    const categoryOptions = useMemo(() => {
        const set = new Set(courses.map((c) => c.mainCategory).filter(Boolean))
        const list = Array.from(set)
        return [
            { value: "all", label: "All Categories" },
            ...list.map((cat) => ({ value: String(cat), label: String(cat) })),
        ]
    }, [courses])

    const sortOptions = [
        { value: "default", label: "Sort by: Default" },
        { value: "price-low", label: "Price: Low to High" },
        { value: "price-high", label: "Price: High to Low" },
    ]

    const processedCourses = useMemo(() => {
        let result = [...courses]
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            result = result.filter(
                (c) =>
                    c.courseName.toLowerCase().includes(q) ||
                    c.description.toLowerCase().includes(q) ||
                    c.mainCategory.toLowerCase().includes(q)
            )
        }
        if (selectedCategory !== "all") {
            result = result.filter((c) => c.mainCategory === selectedCategory)
        }
        if (sortBy === "price-low") {
            result.sort((a, b) => {
                const pA =
                    effectiveCountryCode === "IN"
                        ? a.pricePaise
                        : a.priceUsdCents
                const pB =
                    effectiveCountryCode === "IN"
                        ? b.pricePaise
                        : b.priceUsdCents
                return pA - pB
            })
        } else if (sortBy === "price-high") {
            result.sort((a, b) => {
                const pA =
                    effectiveCountryCode === "IN"
                        ? a.pricePaise
                        : a.priceUsdCents
                const pB =
                    effectiveCountryCode === "IN"
                        ? b.pricePaise
                        : b.priceUsdCents
                return pB - pA
            })
        }
        return result
    }, [courses, searchQuery, selectedCategory, sortBy, effectiveCountryCode])

    const formatPrice = (c: Course) => {
        if (effectiveCountryCode === "IN") {
            const rupees = c.pricePaise / 100
            return new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }).format(rupees)
        } else {
            const dollars = c.priceUsdCents / 100
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(dollars)
        }
    }

    const getCourseIcon = (name = "", category = "") => {
        const n = String(name).toLowerCase()
        const c = String(category).toLowerCase()
        if (n.includes("youtube") || c.includes("youtube"))
            return <Youtube size={18} aria-hidden="true" />
        if (
            n.includes("instagram") ||
            c.includes("instagram") ||
            c.includes("insta")
        )
            return <Instagram size={18} aria-hidden="true" />
        if (n.includes("podcast")) return <Mic size={18} aria-hidden="true" />
        if (n.includes("notion"))
            return <FileText size={18} aria-hidden="true" />
        if (
            n.includes("freelance") ||
            n.includes("client") ||
            c.includes("business")
        )
            return <Briefcase size={18} aria-hidden="true" />
        if (n.includes("video") || n.includes("editing") || c.includes("video"))
            return <Video size={18} aria-hidden="true" />
        if (c.includes("content"))
            return <Sparkles size={18} aria-hidden="true" />
        return <GraduationCap size={18} aria-hidden="true" />
    }

    const toggleCurrency = () => {
        const next = effectiveCountryCode === "IN" ? "US" : "IN"
        setUserCurrencyOverride(next)
    }

    const handleResetFilters = () => {
        setSearchQuery("")
        setSelectedCategory("all")
        setSortBy("default")
    }

    useEffect(() => {
        if (typeof document === "undefined") return
        const fontId = "skillpath-google-fonts"
        if (!document.getElementById(fontId)) {
            const link = document.createElement("link")
            link.id = fontId
            link.rel = "stylesheet"
            link.href =
                "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap"
            document.head.appendChild(link)
        }
    }, [])

    const cardHoverShadow = useMemo(() => {
        return `0 12px 30px ${hexToRgba(accentColor, 0.2)}`
    }, [accentColor])

    return (
        <div
            ref={containerRef}
            role="region"
            aria-label="Skillpath Courses Section"
            className={`skillpath-courses-section ${className}`}
            style={{
                width: "100%",
                minHeight: "600px",
                boxSizing: "border-box",
                margin: 0,
                padding: 0,
                background: "linear-gradient(180deg, #f0f4f8 0%, #e1e9f1 100%)",
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                ...style,
            }}
            {...restProps}
        >
            <style>{`
                @keyframes framerPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.45; }
                }

                /* FOOTER LINKS HOVER COLOR */
                .sp-footer-link {
                    color: #475569 !important;
                    text-decoration: none !important;
                    font-size: 0.9rem !important;
                    font-weight: 500 !important;
                    transition: color 0.15s ease !important;
                }

                .sp-footer-link:hover {
                    color: ${accentColor} !important;
                }

                .sp-select-trigger:hover {
                    border-color: #cbd5e1 !important;
                }

                /* TABLET BREAKPOINT (max-width: 1023px) */
                @media (max-width: 1023px) {
                    .sp-courses-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 1.25rem !important;
                    }
                    .sp-controls-bar {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 0.85rem !important;
                    }
                    .sp-search-box {
                        width: 100% !important;
                    }
                    .sp-controls-right {
                        width: 100% !important;
                        display: flex !important;
                        gap: 0.65rem !important;
                        flex-wrap: wrap !important;
                    }
                }

                /* MOBILE BREAKPOINT (max-width: 639px) */
                @media (max-width: 639px) {
                    .sp-main {
                        padding: 0 1.25rem 2.5rem !important;
                    }
                    .sp-hero {
                        padding: 3.5rem 1.25rem 2rem !important;
                    }
                    .sp-hero-title {
                        font-size: clamp(1.8rem, 6.5vw, 2.4rem) !important;
                        line-height: 1.15 !important;
                    }
                    .sp-hero-subtitle {
                        font-size: clamp(0.9rem, 3vw, 1rem) !important;
                    }
                    .sp-section-heading {
                        font-size: clamp(1.4rem, 4.5vw, 1.8rem) !important;
                    }
                    .sp-header-row {
                        flex-direction: row !important;
                        align-items: center !important;
                        justify-content: space-between !important;
                        margin-bottom: 1.25rem !important;
                    }
                    .sp-controls-bar {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        border-radius: 20px !important;
                        padding: 0.85rem !important;
                        gap: 0.75rem !important;
                        margin-bottom: 1.75rem !important;
                    }
                    .sp-search-box {
                        width: 100% !important;
                        min-width: 0 !important;
                    }
                    .sp-controls-right {
                        width: 100% !important;
                        display: grid !important;
                        grid-template-columns: 1fr 1fr !important;
                        gap: 0.65rem !important;
                    }
                    .sp-select-container {
                        width: 100% !important;
                        min-width: 0 !important;
                    }
                    .sp-select-trigger {
                        width: 100% !important;
                        min-width: 0 !important;
                        font-size: clamp(0.75rem, 2.5vw, 0.8rem) !important;
                        padding: 0 0.6rem !important;
                    }
                    .sp-currency-toggle {
                        grid-column: span 2 !important;
                        width: 100% !important;
                        display: flex !important;
                        justify-content: center !important;
                        margin-left: 0 !important;
                    }
                    .sp-currency-segment {
                        flex: 1 !important;
                    }
                    .sp-courses-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.25rem !important;
                    }
                    .sp-footer-content {
                        flex-direction: column !important;
                        text-align: center !important;
                        gap: 1.25rem !important;
                    }
                    .sp-footer-links {
                        justify-content: center !important;
                        gap: 1.25rem !important;
                    }
                }
            `}</style>

            {/* HERO BANNER */}
            {showHero && (
                <header
                    className="sp-hero"
                    style={{
                        padding: "4.5rem 1.5rem 3rem",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        maxWidth: "1180px",
                        margin: "0 auto",
                    }}
                >
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.4rem 1rem",
                            borderRadius: "9999px",
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                            color: "#475569",
                            fontSize: "clamp(0.75rem, 2.2vw, 0.825rem)",
                            fontWeight: 500,
                            marginBottom: "1.5rem",
                        }}
                    >
                        <span
                            style={{
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                background: accentColor,
                            }}
                        />
                        Interactive Learning Platform
                    </div>

                    <h1
                        className="sp-hero-title"
                        style={{
                            fontFamily: "'Outfit', 'Inter', sans-serif",
                            fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
                            fontWeight: 800,
                            color: "#0f172a",
                            lineHeight: 1.12,
                            marginBottom: "1rem",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Master High-Impact Digital Skills.
                        <br />
                        Build Your Career Path.
                    </h1>

                    <p
                        className="sp-hero-subtitle"
                        style={{
                            fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)",
                            color: "#64748b",
                            maxWidth: "600px",
                            margin: "0 auto 2rem",
                            lineHeight: 1.6,
                        }}
                    >
                        From concept to execution, learn practical systems with
                        real-world projects designed for modern creators and
                        engineering professionals.
                    </p>

                    <a
                        href="#courses-section"
                        onClick={handleScrollToCourses}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            height: "2.75rem",
                            padding: "0 1.75rem",
                            borderRadius: "9999px",
                            background: accentColor,
                            color: "#ffffff",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            textDecoration: "none",
                            boxShadow: `0 10px 25px ${hexToRgba(accentColor, 0.3)}`,
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                        }}
                    >
                        <span>Explore Courses</span>
                        <ArrowRight size={16} aria-hidden="true" />
                    </a>
                </header>
            )}

            {/* MAIN CONTENT SECTION */}
            <main
                ref={mainSectionRef}
                id="courses-section"
                className="sp-main"
                style={{
                    maxWidth: "1180px",
                    margin: "0 auto",
                    padding: "0 1.5rem 3rem",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                {/* Section Header Row */}
                <div
                    className="sp-header-row"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                        marginBottom: "1.5rem",
                    }}
                >
                    <h2
                        className="sp-section-heading"
                        style={{
                            fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
                            fontWeight: 800,
                            color: "#0f172a",
                            fontFamily: "'Outfit', 'Inter', sans-serif",
                            margin: 0,
                        }}
                    >
                        {title}
                    </h2>
                    <div
                        role="status"
                        aria-live="polite"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.4rem 0.9rem",
                            borderRadius: "9999px",
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            fontSize: "0.8rem",
                            color: "#475569",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                        }}
                    >
                        <Globe size={14} aria-hidden="true" />
                        <span>
                            Region:{" "}
                            <strong>
                                {effectiveCountryCode === "IN"
                                    ? "India"
                                    : "United States"}
                            </strong>
                        </span>
                    </div>
                </div>

                {/* Controls Bar with Custom Selects & Currency Pill Toggle */}
                {(showSearch || showFilter) && (
                    <div
                        className="sp-controls-bar"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.75rem",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "1.75rem",
                            background: "#ffffff",
                            padding: "0.85rem",
                            borderRadius: "20px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                        }}
                    >
                        {showSearch && (
                            <div
                                className="sp-search-box"
                                style={{
                                    flex: 1,
                                    minWidth: "220px",
                                    position: "relative",
                                }}
                            >
                                <Search
                                    size={15}
                                    aria-hidden="true"
                                    style={{
                                        position: "absolute",
                                        left: "1rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#64748b",
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Search courses"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    aria-label="Search courses"
                                    style={{
                                        width: "100%",
                                        height: "2.25rem",
                                        padding: "0 1rem 0 2.5rem",
                                        borderRadius: "9999px",
                                        border: "1px solid #e2e8f0",
                                        fontSize: "clamp(0.8rem, 2vw, 0.85rem)",
                                        outline: "none",
                                        boxSizing: "border-box",
                                        background: "#ffffff",
                                        color: "#0f172a",
                                    }}
                                />
                            </div>
                        )}

                        {showFilter && (
                            <div
                                className="sp-controls-right"
                                style={{
                                    display: "flex",
                                    gap: "0.65rem",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                }}
                            >
                                {/* CUSTOM SELECT: Category */}
                                {categoryOptions.length > 1 && (
                                    <FramerCustomSelect
                                        value={selectedCategory}
                                        options={categoryOptions}
                                        onChange={setSelectedCategory}
                                        icon={Filter}
                                        accentColor={accentColor}
                                        ariaLabel="Filter category"
                                    />
                                )}

                                {/* CUSTOM SELECT: Sort by Price */}
                                <FramerCustomSelect
                                    value={sortBy}
                                    options={sortOptions}
                                    onChange={setSortBy}
                                    icon={ArrowUpDown}
                                    accentColor={accentColor}
                                    ariaLabel="Sort courses by price"
                                />

                                {/* CURRENCY PILL TOGGLE (with circular $ and ₹ icon badges) */}
                                <FramerCurrencyPillToggle
                                    countryCode={effectiveCountryCode}
                                    onToggle={toggleCurrency}
                                    accentColor={accentColor}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Courses Grid */}
                <div
                    className="sp-courses-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1.35rem",
                    }}
                >
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: "#ffffff",
                                    borderRadius: `${cardRadius}px`,
                                    padding: "1.5rem",
                                    border: "2px solid #e2e8f0",
                                    animation:
                                        !isCanvas && isInView
                                            ? "framerPulse 1.5s infinite ease-in-out"
                                            : "none",
                                }}
                            >
                                <div
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "12px",
                                        background: "#e2e8f0",
                                        marginBottom: "1rem",
                                    }}
                                />
                                <div
                                    style={{
                                        height: "20px",
                                        background: "#e2e8f0",
                                        borderRadius: "6px",
                                        width: "70%",
                                        marginBottom: "0.5rem",
                                    }}
                                />
                                <div
                                    style={{
                                        height: "14px",
                                        background: "#e2e8f0",
                                        borderRadius: "6px",
                                        width: "90%",
                                        marginBottom: "1.5rem",
                                    }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "24px",
                                            background: "#e2e8f0",
                                            borderRadius: "6px",
                                            width: "30%",
                                        }}
                                    />
                                    <div
                                        style={{
                                            height: "24px",
                                            background: "#e2e8f0",
                                            borderRadius: "12px",
                                            width: "40%",
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        <div
                            role="alert"
                            aria-live="assertive"
                            style={{
                                background: "#ffffff",
                                border: "1px solid #fca5a5",
                                borderRadius: `${cardRadius}px`,
                                padding: "2.5rem",
                                textAlign: "center",
                                gridColumn: "1 / -1",
                            }}
                        >
                            <AlertTriangle
                                size={32}
                                color="#ef4444"
                                aria-hidden="true"
                                style={{ margin: "0 auto 1rem" }}
                            />
                            <h3
                                style={{
                                    color: "#dc2626",
                                    fontWeight: 700,
                                    fontSize: "1.25rem",
                                    margin: "0 0 0.5rem 0",
                                }}
                            >
                                Unable to Load Courses
                            </h3>
                            <p
                                style={{
                                    color: "#64748b",
                                    fontSize: "0.9rem",
                                    margin: "0 0 1.25rem 0",
                                }}
                            >
                                {error}
                            </p>
                            <button
                                onClick={() => loadData()}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "0.6rem 1.5rem",
                                    borderRadius: "9999px",
                                    background: accentColor,
                                    color: "#ffffff",
                                    border: "none",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                <RefreshCw size={15} aria-hidden="true" />
                                <span>Retry Request</span>
                            </button>
                        </div>
                    ) : processedCourses.length === 0 ? (
                        /* EMPTY STATE */
                        <div
                            role="status"
                            aria-live="polite"
                            style={{
                                background: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: `${cardRadius}px`,
                                padding: "3.5rem 2rem",
                                textAlign: "center",
                                gridColumn: "1 / -1",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                            }}
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    background: "#f1f5f9",
                                    color: "#64748b",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "1.25rem",
                                }}
                            >
                                <SearchX size={28} aria-hidden="true" />
                            </div>
                            <h3
                                style={{
                                    color: "#0f172a",
                                    fontWeight: 700,
                                    fontSize: "1.35rem",
                                    margin: "0 0 0.5rem 0",
                                    fontFamily: "'Outfit', sans-serif",
                                }}
                            >
                                No Courses Found
                            </h3>
                            <p
                                style={{
                                    color: "#64748b",
                                    fontSize: "0.95rem",
                                    maxWidth: "460px",
                                    margin: "0 auto 1.5rem",
                                    lineHeight: 1.55,
                                }}
                            >
                                {searchQuery
                                    ? `We couldn't find any courses matching "${searchQuery}". Try checking for typos or searching a different term.`
                                    : "There are currently no courses available in this category."}
                            </p>
                            <button
                                onClick={handleResetFilters}
                                style={{
                                    padding: "0.65rem 1.6rem",
                                    borderRadius: "9999px",
                                    background: accentColor,
                                    color: "#ffffff",
                                    border: "none",
                                    fontWeight: 600,
                                    fontSize: "0.875rem",
                                    cursor: "pointer",
                                    boxShadow: `0 4px 14px ${hexToRgba(accentColor, 0.25)}`,
                                    transition: "all 0.2s ease",
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        processedCourses.map((c: Course, i: number) => {
                            const isHovered = hoveredCardIndex === i

                            return (
                                <div
                                    key={c.mangoId}
                                    className="sp-course-card"
                                    tabIndex={0}
                                    onMouseEnter={() => setHoveredCardIndex(i)}
                                    onMouseLeave={() =>
                                        setHoveredCardIndex(null)
                                    }
                                    onFocus={() => setHoveredCardIndex(i)}
                                    onBlur={() => setHoveredCardIndex(null)}
                                    style={{
                                        background: "#ffffff",
                                        borderRadius: `${cardRadius}px`,
                                        padding: "1.35rem 1.25rem",
                                        border: isHovered
                                            ? `2px solid ${accentColor}`
                                            : "2px solid #e2e8f0",
                                        outline: "none",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        boxShadow: isHovered
                                            ? cardHoverShadow
                                            : "0 10px 30px rgba(0, 0, 0, 0.035)",
                                        transform: isHovered
                                            ? "translateY(-3px)"
                                            : "none",
                                        transition:
                                            "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                marginBottom: "0.65rem",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                    borderRadius: "12px",
                                                    background: accentColor,
                                                    color: "#ffffff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {getCourseIcon(
                                                    c.courseName,
                                                    c.mainCategory
                                                )}
                                            </div>
                                            <h3
                                                style={{
                                                    fontSize:
                                                        "clamp(1.05rem, 3vw, 1.2rem)",
                                                    fontWeight: 700,
                                                    color: "#0f172a",
                                                    margin: 0,
                                                    lineHeight: 1.3,
                                                    fontFamily:
                                                        "'Outfit', 'Inter', sans-serif",
                                                }}
                                            >
                                                {c.courseName}
                                            </h3>
                                        </div>
                                        {c.description && (
                                            <p
                                                style={{
                                                    fontSize: "0.875rem",
                                                    color: "#64748b",
                                                    lineHeight: 1.55,
                                                    margin: 0,
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {c.description}
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginTop: "1.25rem",
                                            gap: "0.5rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize:
                                                    "clamp(1.2rem, 3.5vw, 1.35rem)",
                                                fontWeight: 800,
                                                color: "#0f172a",
                                            }}
                                        >
                                            {formatPrice(c)}
                                        </span>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "0.4rem",
                                                alignItems: "center",
                                            }}
                                        >
                                            {c.refundable && (
                                                <span
                                                    style={{
                                                        padding:
                                                            "0 0.75rem 0 0.75rem",
                                                        height: "1.625rem",
                                                        borderRadius: "9999px",
                                                        background: "#10b981",
                                                        color: "#ffffff",
                                                        fontSize: "0.625rem",
                                                        fontWeight: 700,
                                                        textTransform:
                                                            "uppercase",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        boxSizing: "border-box",
                                                        letterSpacing: "0.02em",
                                                    }}
                                                >
                                                    REFUNDABLE
                                                </span>
                                            )}
                                            {c.mainCategory && (
                                                <span
                                                    style={{
                                                        padding:
                                                            "0 0.75rem 0 0.75rem",
                                                        height: "1.625rem",
                                                        borderRadius: "9999px",
                                                        background: accentColor,
                                                        color: "#ffffff",
                                                        fontSize: "0.625rem",
                                                        fontWeight: 600,
                                                        textTransform:
                                                            "uppercase",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        boxSizing: "border-box",
                                                    }}
                                                >
                                                    {c.mainCategory}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </main>

            {/* FOOTER SECTION */}
            {showFooter && (
                <footer
                    className="sp-footer"
                    style={{
                        background: "#ffffff",
                        borderTop: "1px solid #e2e8f0",
                        padding: "2.5rem 1.5rem",
                        marginTop: "1rem",
                    }}
                >
                    <div
                        className="sp-footer-content"
                        style={{
                            maxWidth: "1180px",
                            margin: "0 auto",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "1.5rem",
                        }}
                    >
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                color: "#0f172a",
                            }}
                        >
                            <Command size={18} style={{ color: accentColor }} />
                            <span>Skillpath</span>
                        </div>

                        <nav
                            className="sp-footer-links"
                            style={{
                                display: "flex",
                                gap: "1.75rem",
                                flexWrap: "wrap",
                            }}
                        >
                            <a
                                href="#courses-section"
                                onClick={handleScrollToCourses}
                                className="sp-footer-link"
                            >
                                Courses
                            </a>
                            <a
                                href="#privacy"
                                onClick={(e) => e.preventDefault()}
                                className="sp-footer-link"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#contact"
                                onClick={(e) => e.preventDefault()}
                                className="sp-footer-link"
                            >
                                Contact Us
                            </a>
                        </nav>

                        <p
                            style={{
                                color: "#64748b",
                                fontSize: "0.85rem",
                                margin: 0,
                            }}
                        >
                            © {new Date().getFullYear()} Skillpath Inc. All
                            rights reserved.
                        </p>
                    </div>
                </footer>
            )}
        </div>
    )
}

// Framer defaultProps declaration
SkillpathCourses.defaultProps = {
    title: "Available Courses",
    accentColor: DEFAULT_ACCENT,
    defaultCurrency: "",
    cardRadius: 22,
    showHero: true,
    showFooter: true,
    showSearch: true,
    showFilter: true,
}

// Framer Property Controls registration
addPropertyControls(SkillpathCourses as any, {
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Available Courses",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: DEFAULT_ACCENT,
    },
    defaultCurrency: {
        type: ControlType.Enum,
        title: "Currency",
        options: ["", "US", "IN"],
        optionTitles: ["Auto (API Detect)", "USD ($)", "INR (₹)"],
        defaultValue: "",
    },
    cardRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        min: 8,
        max: 40,
        step: 2,
        defaultValue: 22,
    },
    showHero: {
        type: ControlType.Boolean,
        title: "Show Hero",
        defaultValue: true,
    },
    showFooter: {
        type: ControlType.Boolean,
        title: "Show Footer",
        defaultValue: true,
    },
    showSearch: {
        type: ControlType.Boolean,
        title: "Show Search",
        defaultValue: true,
    },
    showFilter: {
        type: ControlType.Boolean,
        title: "Show Filter",
        defaultValue: true,
    },
})

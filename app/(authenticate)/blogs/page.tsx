import { FaFacebook, FaTwitter, FaLinkedin, FaShareAlt } from "react-icons/fa"
import type { IconType } from "react-icons"

interface BlogPost {
    id: number
    title: string
    author: string
    date: string
    excerpt: string
    image: string
    category: string
    featured?: boolean
}

const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "Maecenas Tincidunt Eget Libero Massa Vitae",
        author: "JOANNA WELLUCK",
        date: "DECEMBER 9, 2018",
        category: "AENEAN ELEIFEND. ALIQUAM",
        excerpt:
            "Aenean eleifend ante maecenas pellenter montes lorem et pede da dolar purus a amar dapibus luctus. Proin eget tortor risus cras ultricies ligula sed vulputate.",
        image: "/images/woman-in-sunglasses-and-scarf-travel.png",
        featured: true,
    },
    {
        id: 2,
        title: "Vulputate — Tellus Etiam Commodo Pellentesque",
        author: "ELLIOT ALDERSON",
        date: "NOVEMBER 22, 2018",
        category: "Nec Elt Quis Massa",
        excerpt:
            "Tellus etiam commodo pellentesque nec elit quis massa. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
        image: "/images/airplane-wing-sky-view.jpg",
    },
    {
        id: 3,
        title: "Etiam — Quis Naseetur Aenean Ipsum Vici",
        author: "JOANNA WELLUCK",
        date: "OCTOBER 15, 2018",
        category: "Category",
        excerpt:
            "Quis nascetur aenean ipsum vici blandit. Sed dignissim lacinia nunc. Curabitur tortor Pellentesque nibh.",
        image: "/images/woman-with-dog-on-plane.jpg",
    },
    {
        id: 4,
        title: "Maecena — Vitae Nec Adipiscing Quis Semper",
        author: "ELLIOT ALDERSON",
        date: "SEPTEMBER 3, 2018",
        category: "Qusm Telus Nascetn",
        excerpt:
            "Vitae nec adipiscing quis semper. Aenean commodo ligula eget dolor. Cum sociis natoque penatibus et magnis.",
        image: "/images/family-on-beach.jpg",
    },
    {
        id: 5,
        title: "Rhoncus — Et Tellus Id Magnis Nsl Maecenas",
        author: "JOANNA WELLUCK",
        date: "AUGUST 19, 2018",
        category: "Pel Pellentesque",
        excerpt:
            "Et tellus id magnis nsl maecenas rhoncus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
        image: "/images/coffee-shop-interior.jpg",
    },
]

const shareButtons: { Icon: IconType; label: string }[] = [
    { Icon: FaFacebook, label: "Facebook" },
    { Icon: FaTwitter, label: "Twitter" },
    { Icon: FaLinkedin, label: "LinkedIn" },
    { Icon: FaShareAlt, label: "Share" },
]

const footerSections: { title: string; links: { label: string; href: string }[] }[] = [
    { title: "Company", links: [{ label: "About Us", href: "#" }, { label: "Blog", href: "#" }, { label: "Contact", href: "#" }] },
    { title: "Resources", links: [{ label: "Documentation", href: "#" }, { label: "FAQ", href: "#" }, { label: "Support", href: "#" }] },
    { title: "Legal", links: [{ label: "Privacy Policy", href: "#" }, { label: "Terms of Service", href: "#" }] },
]

const socialLinks: { Icon: IconType; href: string; label: string }[] = [
    { Icon: FaFacebook, href: "#", label: "Facebook" },
    { Icon: FaTwitter, href: "#", label: "Twitter" },
    { Icon: FaLinkedin, href: "#", label: "LinkedIn" },
]

function BlogCard({ post, variant }: { post: BlogPost; variant: "featured" | "grid" }) {
    const imageSrc = post.image.startsWith("/") ? post.image : `/${post.image}`

    if (variant === "featured") {
        return (
            <article className="space-y-6">
                <div className="overflow-hidden rounded-lg">
                    <img
                        src={imageSrc || "/placeholder.svg"}
                        alt={post.title}
                        className="h-80 w-full object-cover"
                    />
                </div>
                <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {post.category}
                    </p>
                    <h2 className="mb-4 text-3xl font-bold leading-tight text-foreground">{post.title}</h2>
                    <p className="mb-4 text-sm text-muted-foreground">{post.excerpt}</p>
                    <div className="mb-6 flex items-center gap-3 border-t border-b border-border py-4">
                        <div className="h-10 w-10 rounded-full bg-accent" />
                        <div>
                            <p className="text-sm font-semibold text-foreground">{post.author}</p>
                            <p className="text-xs text-muted-foreground">{post.date}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {shareButtons.map(({ Icon, label }) => (
                            <button
                                key={label}
                                type="button"
                                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
                                aria-label={label}
                            >
                                <Icon className="h-4 w-4" />
                            </button>
                        ))}
                    </div>
                </div>
            </article>
        )
    }

    return (
        <article className="group overflow-hidden rounded-lg border border-border transition-all hover:shadow-lg">
            <div className="overflow-hidden">
                <img
                    src={imageSrc || "/placeholder.svg"}
                    alt={post.title}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                />
            </div>
            <div className="p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{post.category}</p>
                <h3 className="mb-3 text-lg font-bold leading-snug text-foreground group-hover:text-accent">
                    {post.title}
                </h3>
                <p className="text-sm text-muted-foreground">{post.author}</p>
            </div>
        </article>
    )
}

export default async function BlogsPage() {
    await new Promise((resolve) => {
        setTimeout(() => resolve("intentional delay"), 2000)
    })

    const featuredPost = blogPosts.find((post) => post.featured)
    const otherPosts = blogPosts.filter((post) => !post.featured)

    return (
        <div className="min-h-screen bg-background">
            <main className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-12 lg:grid-cols-3">
                    {featuredPost && (
                        <div className="lg:col-span-1">
                            <BlogCard post={featuredPost} variant="featured" />
                        </div>
                    )}
                    <div className="lg:col-span-2">
                        <div className="grid gap-8 md:grid-cols-2">
                            {otherPosts.map((post) => (
                                <BlogCard key={post.id} post={post} variant="grid" />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-border bg-secondary py-12">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-8 md:grid-cols-4">
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="mb-4 font-bold text-foreground">{section.title}</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <a href={link.href} className="hover:text-foreground">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <div>
                            <h3 className="mb-4 font-bold text-foreground">Follow</h3>
                            <div className="flex gap-4">
                                {socialLinks.map(({ Icon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        className="text-muted-foreground hover:text-foreground"
                                        aria-label={label}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; 2025 FamilyRoots. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

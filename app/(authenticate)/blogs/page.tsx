"use client"
import { FaFacebook, FaTwitter, FaLinkedin, FaShareAlt } from "react-icons/fa"

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
        category: "Nec Elt Quis Massa",
        image: "images/airplane-wing-sky-view.jpg",
    },
    {
        id: 3,
        title: "Etiam — Quis Naseetur Aenean Ipsum Vici",
        author: "JOANNA WELLUCK",
        category: "Category",
        image: "images/woman-with-dog-on-plane.jpg",
    },
    {
        id: 4,
        title: "Maecena — Vitae Nec Adipiscing Quis Semper",
        author: "ELLIOT ALDERSON",
        category: "Qusm Telus Nascetn",
        image: "images/family-on-beach.jpg",
    },
    {
        id: 5,
        title: "Rhoncus — Et Tellus Id Magnis Nsl Maecenas",
        author: "JOANNA WELLUCK",
        category: "Pel Pellentesque",
        image: "images/coffee-shop-interior.jpg",
    },
]

export default async function BlogsPage() {

    await new Promise(resolve => {
        setTimeout(() => {
            resolve("intentional delay")
        }, 2000);
    })

    const featuredPost = blogPosts.find((post) => post.featured)
    const otherPosts = blogPosts.filter((post) => !post.featured)

    return (
        <div className="min-h-screen bg-background">


            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Featured Post */}
                    {featuredPost && (
                        <div className="lg:col-span-1">
                            <article className="space-y-6">
                                <div className="overflow-hidden rounded-lg">
                                    <img
                                        src={featuredPost.image || "/placeholder.svg"}
                                        alt={featuredPost.title}
                                        className="h-80 w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        {featuredPost.category}
                                    </p>
                                    <h2 className="mb-4 text-3xl font-bold leading-tight text-foreground">{featuredPost.title}</h2>
                                    <p className="mb-4 text-sm text-muted-foreground">{featuredPost.excerpt}</p>

                                    {/* Author Info */}
                                    <div className="mb-6 flex items-center gap-3 border-t border-b border-border py-4">
                                        <div className="h-10 w-10 rounded-full bg-accent"></div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{featuredPost.author}</p>
                                            <p className="text-xs text-muted-foreground">{featuredPost.date}</p>
                                        </div>
                                    </div>

                                    {/* Share Buttons */}
                                    <div className="flex gap-3">
                                        <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">
                                            <FaFacebook className="h-4 w-4" />
                                        </button>
                                        <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">
                                            <FaTwitter className="h-4 w-4" />
                                        </button>
                                        <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">
                                            <FaLinkedin className="h-4 w-4" />
                                        </button>
                                        <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">
                                            <FaShareAlt className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        </div>
                    )}

                    {/* Blog Grid */}
                    <div className="lg:col-span-2">
                        <div className="grid gap-8 md:grid-cols-2">
                            {otherPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="group overflow-hidden rounded-lg border border-border transition-all hover:shadow-lg"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={post.image || "/placeholder.svg"}
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
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-secondary py-12">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div>
                            <h3 className="mb-4 font-bold text-foreground">Company</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-bold text-foreground">Resources</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Support
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-bold text-foreground">Legal</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-bold text-foreground">Follow</h3>
                            <div className="flex gap-4">
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    <FaFacebook className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    <FaTwitter className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    <FaLinkedin className="h-5 w-5" />
                                </a>
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

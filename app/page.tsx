import Link from "next/link"
import { ArrowRight, Users, Leaf, Lock, Share2 } from "lucide-react"


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-amber-700" />
          <span className="text-xl font-serif font-bold text-amber-900">FamilyRoots</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-amber-800 hover:text-amber-900 transition">
            Sign In
          </Link>
          <Link href="/signup" className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 leading-tight">
              Discover and Document Your Family Legacy
            </h1>
            <p className="text-lg text-amber-800/80 leading-relaxed">
              Connect with your heritage. Build your family tree, share stories, and preserve your family's history for
              generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition font-medium flex items-center justify-center gap-2"
              >
                Start Building <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="border-2 border-amber-700 text-amber-700 px-8 py-3 rounded-lg hover:bg-amber-50 transition font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Visual - Hero Image Placeholder */}
          <div className="bg-gradient-to-br from-amber-200 to-amber-100 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
            <div className="text-center">
              <Users className="w-20 h-20 text-amber-700/40 mx-auto mb-4" />
              <p className="text-amber-800/60 font-medium">Your family tree awaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 md:py-24 border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-4">Why Choose FamilyRoots?</h2>
            <p className="text-lg text-amber-800/70 max-w-2xl mx-auto">
              Powerful tools designed to help you create, organize, and share your family's unique story.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-amber-50/50 rounded-xl border border-amber-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-3">Build Your Tree</h3>
              <p className="text-amber-800/70 leading-relaxed">
                Easily add family members, create connections, and visualize your family relationships across
                generations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-amber-50/50 rounded-xl border border-amber-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-3">Share Stories</h3>
              <p className="text-amber-800/70 leading-relaxed">
                Add photos, documents, and memories to each family member. Keep your family's stories alive and
                accessible.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-amber-50/50 rounded-xl border border-amber-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-3">Private & Secure</h3>
              <p className="text-amber-800/70 leading-relaxed">
                Control who sees your family information. Your data stays private and protected with enterprise-grade
                security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-700 text-white rounded-full flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-3">Create Your Account</h3>
              <p className="text-amber-800/70 leading-relaxed">
                Sign up and set up your family profile in just a few minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-700 text-white rounded-full flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-3">Add Your Relatives</h3>
              <p className="text-amber-800/70 leading-relaxed">
                Build your family tree by adding names, dates, and relationships.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-700 text-white rounded-full flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-3">Share & Preserve</h3>
              <p className="text-amber-800/70 leading-relaxed">
                Invite family members and preserve your legacy for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Ready to Explore Your Family History?</h2>
          <p className="text-lg text-amber-100">Join thousands of families preserving their legacy with FamilyRoots.</p>
          <Link
            href="/signup"
            className="inline-block bg-white text-amber-900 px-8 py-3 rounded-lg hover:bg-amber-50 transition font-semibold"
          >
            Start Your Journey Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-100 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-amber-700" />
                <span className="font-serif font-bold text-amber-900">FamilyRoots</span>
              </div>
              <p className="text-sm text-amber-800/70">Preserving family legacies, one tree at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-amber-800/70">
                <li>
                  <Link href="#" className="hover:text-amber-900 transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-900 transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-900 transition">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-amber-800/70">
                <li>
                  <Link href="#" className="hover:text-amber-900 transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-900 transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-900 transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-amber-800/70">
                <li>
                  <Link href="#" className="hover:text-amber-900 transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-900 transition">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-900 transition">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-100 pt-8">
            <p className="text-center text-sm text-amber-800/70">© 2025 FamilyRoots. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

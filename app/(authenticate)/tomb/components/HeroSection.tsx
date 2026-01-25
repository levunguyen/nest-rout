import { motion } from "framer-motion";

const HeroSection = () => {
    return (
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/hero-memorial.jpg')",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-background" />


            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="font-serif text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
                        Tưởng Nhớ Gia Đình
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl font-sans text-lg text-primary-foreground/90 md:text-xl">
                        Nơi lưu giữ ký ức và tưởng nhớ những người thân yêu đã khuất
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-8"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3 backdrop-blur-sm">
                        <span className="font-sans text-sm text-primary-foreground/90">
                            Dòng họ Nguyễn
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="h-10 w-6 rounded-full border-2 border-primary-foreground/50 p-1"
                >
                    <div className="h-2 w-full rounded-full bg-primary-foreground/70" />
                </motion.div>
            </motion.div>
        </section >
    );
};

export default HeroSection;

import { ReactNode } from "react";
import { motion } from "motion/react";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    id?: string;
}

export function ScrollReveal({ children, className = "", delay = 0, id }: ScrollRevealProps) {
    return (
        <motion.div
            id={id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

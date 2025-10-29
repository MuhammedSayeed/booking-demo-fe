"use client"

import { motion, AnimatePresence, Variants } from "framer-motion"
import { ReactNode } from "react"

// Animation variants
export const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3, ease: "easeIn" }
    }
}

export const slideInLeftVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        x: -50,
        transition: { duration: 0.3, ease: "easeIn" }
    }
}

export const slideInRightVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        x: 50,
        transition: { duration: 0.3, ease: "easeIn" }
    }
}

export const scaleInVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.3, ease: "easeIn" }
    }
}

export const bounceInVariants: Variants = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.68, -0.55, 0.265, 1.55]
        }
    },
    exit: {
        opacity: 0,
        scale: 0.3,
        transition: { duration: 0.3, ease: "easeIn" }
    }
}

export const staggerChildrenVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
}

export const floatVariants: Variants = {
    float: {
        y: [-10, 10, -10],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
}

// Animated Components
interface AnimatedContainerProps {
    children: ReactNode
    className?: string
    variants?: Variants
    initial?: string
    animate?: string
    exit?: string
    delay?: number
}

export const AnimatedContainer = ({
    children,
    className,
    variants = fadeInVariants,
    initial = "hidden",
    animate = "visible",
    exit = "exit",
    delay = 0
}: AnimatedContainerProps) => (
    <motion.div
        className={className}
        variants={variants}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{ delay }}
    >
        {children}
    </motion.div>
)

export const FadeIn = ({ children, className, delay = 0 }: { children: ReactNode, className?: string, delay?: number }) => (
    <AnimatedContainer className={className} variants={fadeInVariants} delay={delay}>
        {children}
    </AnimatedContainer>
)

export const SlideInLeft = ({ children, className, delay = 0 }: { children: ReactNode, className?: string, delay?: number }) => (
    <AnimatedContainer className={className} variants={slideInLeftVariants} delay={delay}>
        {children}
    </AnimatedContainer>
)

export const SlideInRight = ({ children, className, delay = 0 }: { children: ReactNode, className?: string, delay?: number }) => (
    <AnimatedContainer className={className} variants={slideInRightVariants} delay={delay}>
        {children}
    </AnimatedContainer>
)

export const ScaleIn = ({ children, className, delay = 0 }: { children: ReactNode, className?: string, delay?: number }) => (
    <AnimatedContainer className={className} variants={scaleInVariants} delay={delay}>
        {children}
    </AnimatedContainer>
)

export const BounceIn = ({ children, className, delay = 0 }: { children: ReactNode, className?: string, delay?: number }) => (
    <AnimatedContainer className={className} variants={bounceInVariants} delay={delay}>
        {children}
    </AnimatedContainer>
)

export const Float = ({ children, className }: { children: ReactNode, className?: string }) => (
    <motion.div
        className={className}
        variants={floatVariants}
        animate="float"
    >
        {children}
    </motion.div>
)

export const StaggeredContainer = ({ children, className }: { children: ReactNode, className?: string }) => (
    <motion.div
        className={className}
        variants={staggerChildrenVariants}
        initial="hidden"
        animate="visible"
    >
        {children}
    </motion.div>
)

// Hover animations
export const HoverScale = ({
    children,
    className,
    scale = 1.05,
    duration = 0.2
}: {
    children: ReactNode,
    className?: string,
    scale?: number,
    duration?: number
}) => (
    <motion.div
        className={className}
        whileHover={{ scale }}
        whileTap={{ scale: scale * 0.95 }}
        transition={{ duration, ease: "easeOut" }}
    >
        {children}
    </motion.div>
)

export const HoverGlow = ({
    children,
    className
}: {
    children: ReactNode,
    className?: string
}) => (
    <motion.div
        className={className}
        whileHover={{
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
            scale: 1.02
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
    >
        {children}
    </motion.div>
)

// Page transitions
export const PageTransition = ({ children }: { children: ReactNode }) => (
    <AnimatePresence mode="wait">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    </AnimatePresence>
) 
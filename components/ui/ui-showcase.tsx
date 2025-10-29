"use client"

import { Button } from "@/components/ui/button"
import {
    FadeIn,
    SlideInLeft,
    SlideInRight,
    ScaleIn,
    BounceIn,
    HoverScale,
    HoverGlow,
    StaggeredContainer,
    Float
} from "@/components/ui/animated-components"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function UIShowcase() {
    return (
        <div className="max-w-6xl mx-auto p-8 space-y-12">
            {/* Header */}
            <FadeIn className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Enhanced UI Components
                </h1>
                <p className="text-muted-foreground text-lg">
                    Showcasing customized shadcn components with rounded designs and smooth animations
                </p>
            </FadeIn>

            {/* Button Variants Section */}
            <StaggeredContainer className="space-y-8">
                <SlideInLeft>
                    <Card className="rounded-2xl border-2">
                        <CardHeader>
                            <CardTitle className="text-2xl">Button Variants</CardTitle>
                            <CardDescription>
                                Enhanced buttons with more rounded corners and smooth hover effects
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Default Buttons */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Default Variants</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="default">Primary Button</Button>
                                    <Button variant="secondary">Secondary Button</Button>
                                    <Button variant="outline">Outline Button</Button>
                                    <Button variant="ghost">Ghost Button</Button>
                                    <Button variant="destructive">Destructive Button</Button>
                                    <Button variant="link">Link Button</Button>
                                </div>
                            </div>

                            {/* New Variants */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">New Variants</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="gradient">Gradient Button</Button>
                                    <Button variant="shimmer">Shimmer Button</Button>
                                </div>
                            </div>

                            {/* Rounded Variants */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Rounded Variants</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button rounded="sm">Small Rounded</Button>
                                    <Button rounded="md">Medium Rounded</Button>
                                    <Button rounded="lg">Large Rounded</Button>
                                    <Button rounded="xl">Extra Large Rounded</Button>
                                    <Button rounded="full">Fully Rounded</Button>
                                </div>
                            </div>

                            {/* Size Variants */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Size Variants</h3>
                                <div className="flex flex-wrap items-center gap-4">
                                    <Button size="sm">Small</Button>
                                    <Button size="default">Default</Button>
                                    <Button size="lg">Large</Button>
                                    <Button size="xl">Extra Large</Button>
                                    <Button size="icon" rounded="full">🚀</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </SlideInLeft>

                {/* Animation Examples */}
                <SlideInRight>
                    <Card className="rounded-2xl border-2">
                        <CardHeader>
                            <CardTitle className="text-2xl">Animation Examples</CardTitle>
                            <CardDescription>
                                Various entrance animations using framer-motion
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <FadeIn delay={0.1}>
                                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-2xl text-center">
                                        <h4 className="font-semibold mb-2">Fade In</h4>
                                        <p className="text-sm text-muted-foreground">Smooth fade animation</p>
                                    </div>
                                </FadeIn>

                                <SlideInLeft delay={0.2}>
                                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 rounded-2xl text-center">
                                        <h4 className="font-semibold mb-2">Slide In Left</h4>
                                        <p className="text-sm text-muted-foreground">Slides from the left</p>
                                    </div>
                                </SlideInLeft>

                                <SlideInRight delay={0.3}>
                                    <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 rounded-2xl text-center">
                                        <h4 className="font-semibold mb-2">Slide In Right</h4>
                                        <p className="text-sm text-muted-foreground">Slides from the right</p>
                                    </div>
                                </SlideInRight>

                                <ScaleIn delay={0.4}>
                                    <div className="p-6 bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-900 rounded-2xl text-center">
                                        <h4 className="font-semibold mb-2">Scale In</h4>
                                        <p className="text-sm text-muted-foreground">Scales up smoothly</p>
                                    </div>
                                </ScaleIn>

                                <BounceIn delay={0.5}>
                                    <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-900 rounded-2xl text-center">
                                        <h4 className="font-semibold mb-2">Bounce In</h4>
                                        <p className="text-sm text-muted-foreground">Bouncy entrance</p>
                                    </div>
                                </BounceIn>

                                <Float>
                                    <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-950 dark:to-blue-900 rounded-2xl text-center">
                                        <h4 className="font-semibold mb-2">Float</h4>
                                        <p className="text-sm text-muted-foreground">Continuous floating</p>
                                    </div>
                                </Float>
                            </div>
                        </CardContent>
                    </Card>
                </SlideInRight>

                {/* Interactive Elements */}
                <ScaleIn delay={0.6}>
                    <Card className="rounded-2xl border-2">
                        <CardHeader>
                            <CardTitle className="text-2xl">Interactive Elements</CardTitle>
                            <CardDescription>
                                Hover and interaction animations for better user experience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Hover Scale Effects</h4>
                                    <div className="space-y-4">
                                        <HoverScale className="p-4 bg-primary/10 rounded-xl border-2 border-primary/20 text-center cursor-pointer">
                                            <p className="font-medium">Hover to Scale</p>
                                            <p className="text-sm text-muted-foreground">Subtle scale animation</p>
                                        </HoverScale>

                                        <HoverScale scale={1.1} className="p-4 bg-secondary rounded-xl text-center cursor-pointer">
                                            <p className="font-medium">Bigger Scale</p>
                                            <p className="text-sm text-muted-foreground">More dramatic scaling</p>
                                        </HoverScale>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold">Hover Glow Effects</h4>
                                    <div className="space-y-4">
                                        <HoverGlow className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-center cursor-pointer">
                                            <p className="font-medium">Hover for Glow</p>
                                            <p className="text-sm opacity-90">Beautiful glow effect</p>
                                        </HoverGlow>

                                        <HoverGlow className="p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl text-center cursor-pointer">
                                            <p className="font-medium">Another Glow</p>
                                            <p className="text-sm opacity-90">Smooth glow animation</p>
                                        </HoverGlow>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </ScaleIn>

                {/* Enhanced Button Examples */}
                <BounceIn delay={0.8}>
                    <Card className="rounded-2xl border-2">
                        <CardHeader>
                            <CardTitle className="text-2xl">Enhanced Button Examples</CardTitle>
                            <CardDescription>
                                Real-world button examples with the new styling
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-center">Primary Actions</h4>
                                    <div className="space-y-3">
                                        <Button className="w-full" size="lg" rounded="lg">
                                            Get Started
                                        </Button>
                                        <Button variant="gradient" className="w-full" size="lg" rounded="xl">
                                            Subscribe Now
                                        </Button>
                                        <Button variant="shimmer" className="w-full" size="lg" rounded="full">
                                            Special Offer
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-center">Secondary Actions</h4>
                                    <div className="space-y-3">
                                        <Button variant="outline" className="w-full" size="lg" rounded="lg">
                                            Learn More
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg" rounded="xl">
                                            View Details
                                        </Button>
                                        <Button variant="ghost" className="w-full" size="lg" rounded="full">
                                            Skip for Now
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-center">Icon Buttons</h4>
                                    <div className="flex justify-center space-x-3">
                                        <Button size="icon" rounded="full" variant="outline">
                                            ❤️
                                        </Button>
                                        <Button size="icon" rounded="full" variant="secondary">
                                            🔥
                                        </Button>
                                        <Button size="icon" rounded="full" variant="gradient">
                                            ⭐
                                        </Button>
                                    </div>
                                    <div className="space-y-3 mt-4">
                                        <Button variant="destructive" className="w-full" size="lg" rounded="lg">
                                            Delete Account
                                        </Button>
                                        <Button variant="link" className="w-full" size="lg">
                                            Forgot Password?
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </BounceIn>
            </StaggeredContainer>
        </div>
    )
} 
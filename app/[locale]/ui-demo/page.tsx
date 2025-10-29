import { UIShowcase } from "@/components/ui/ui-showcase"
import { PageTransition } from "@/components/ui/animated-components"

export default function UIDemoPage() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <UIShowcase />
            </div>
        </PageTransition>
    )
}

export const metadata = {
    title: "UI Demo - Enhanced Components",
    description: "Showcase of enhanced shadcn components with rounded designs and smooth animations",
} 
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { SpecialServices } from "../components/SpecialServices";
import { Features } from "../components/Features";
import { WhyFinovert } from "../components/WhyFinovert";
import { UseCases } from "../components/UseCases";
import { SEO } from "../components/SEO";

export function HomePage() {
    return (
        <>
            <SEO
                title="Finance, Compliance and Technology Solutions"
                description="Finovert helps startups and businesses with finance operations, compliance, and technology-backed growth services."
                path="/"
                keywords={[
                    "finance services",
                    "business compliance",
                    "startup finance",
                    "finovert",
                    "technology solutions",
                ]}
            />
            <Hero />
            <About />
            <SpecialServices />
            <Features />
            <WhyFinovert />
            <UseCases />
        </>
    );
}

import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { SpecialServices } from "../components/SpecialServices";
import { Features } from "../components/Features";
import { WhyFinovert } from "../components/WhyFinovert";
import { UseCases } from "../components/UseCases";

export function HomePage() {
    return (
        <>
            <Hero />
            <About />
            <SpecialServices />
            <Features />
            <WhyFinovert />
            <UseCases />
        </>
    );
}

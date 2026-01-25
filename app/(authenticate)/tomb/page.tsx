"use client"


import HeroSection from "./components/HeroSection";
import FamilyGrid from "./components/FamilyGrid";
import LocationMap from "./components/LocationMap";


const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <HeroSection />
            <FamilyGrid />
            <LocationMap />

        </div>
    );
};

export default Index;

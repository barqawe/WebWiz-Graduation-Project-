import Header from "@/components/Header/Header.jsx";
import Footer from "@/components/Footer/Footer.jsx";

import ProblemsTable from "@/components/ProblemsPage/ProblemsTable/ProblemsTable.jsx"; //removed
import SideContent from "@/components/ProblemsPage/SIdeContent/SideContent.jsx"; //removed
import ProblemsDeck from "@/components/ProblemsPage/problemsDeck/problemsDeck";
import TopNavButtons from "@/components/ProblemsPage/TopNavButtons/TopNavButtons";

export default function ProblemsPage() {
  return (
    <div className="min-h-[200vh] flex flex-col">
      <Header />
      {/* this may become  */}
      <main className="min-w-[80vw] sm:min-w-[85vw] md:min-w-[80vw] lg:min-w-[75vw] xl:min-w-[80vw] mx-auto">
        <ProblemsDeck />
      </main>
      <Footer />
    </div>
  );
}

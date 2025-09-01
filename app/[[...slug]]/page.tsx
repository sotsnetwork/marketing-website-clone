import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeneralEvents } from "../../lib/basehub/fragments";
import { basehub, fragmentOn } from "basehub";
import { AccordionFaq } from "../_sections/accordion-faq";
import { BigFeature, bigFeatureFragment } from "../_sections/features/big-feature";
import { Callout, calloutFragment } from "../_sections/callout-1";
import { Callout2, calloutv2Fragment } from "../_sections/callout-2";
import { Companies, companiesFragment } from "../_sections/companies";
import { Faq, faqFragment } from "../_sections/faq";
import { FeaturesGrid, featuresGridFragment } from "../_sections/features/features-grid";
import { FeaturesList, featureCardsComponent } from "../_sections/features/features-list";
import { Hero, heroFragment } from "../_sections/hero";
import { Pricing, pricingFragment } from "../_sections/pricing";
import { SideFeatures, featuresSideBySideFragment } from "../_sections/features/side-features";
import { Testimonials, testimonialsSliderFragment } from "../_sections/testimonials";
import { TestimonialsGrid, testimonialsGridFragment } from "../_sections/testimonials-grid";
import { PricingTable } from "../_sections/pricing-comparation";
import { pricingTableFragment } from "../_sections/pricing-comparation/fragments";
import FeatureHero, { featureHeroFragment } from "../_sections/features/features-hero";
import { PageView } from "../../components/page-view";
import { FreeformText, freeformTextFragment } from "../_sections/freeform-text";
import { Form, formFragment } from "../_sections/form";
import {
  settingsLogoLiteFragment,
  SettingsLogoLiteFragment,
} from "../../components/form-components";
import "../../basehub.config";

// Mock data for local development when Basehub is not available
const mockData = {
  site: {
    pages: {
      items: [
        {
          pathname: "/",
          _id: "home",
          _analyticsKey: "home-page",
          sections: [],
        },
        {
          pathname: "/pricing",
          _id: "pricing",
          _analyticsKey: "pricing-page",
          sections: [],
        },
        {
          pathname: "/features",
          _id: "features",
          _analyticsKey: "features-page",
          sections: [],
        },
      ],
    },
    settings: {
      metadata: {
        defaultTitle: "Marketing Website",
        titleTemplate: "%s | Marketing Website",
        defaultDescription: "A modern marketing website built with Next.js and Basehub",
      },
      theme: {
        primaryColor: "#3B82F6",
        secondaryColor: "#10B981",
      },
      logo: {
        light: {
          url: "/placeholder-logo.svg",
          alt: "Logo",
          width: 120,
          height: 40,
        },
        dark: {
          url: "/placeholder-logo.svg",
          alt: "Logo",
          width: 120,
          height: 40,
        },
      },
    },
    generalEvents: {
      ingestKey: "demo-key",
    },
  },
};

export const dynamic = "force-static";
export const revalidate = 30;

export const generateStaticParams = async () => {
  try {
    const data = await basehub().query({
      site: {
        pages: {
          items: {
            pathname: true,
          },
        },
      },
    });

    return data.site.pages.items.map((item) => ({
      slug: item.pathname.split("/").filter(Boolean),
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    // Return mock data for local development
    return mockData.site.pages.items.map((item) => ({
      slug: item.pathname.split("/").filter(Boolean),
    }));
  }
};

export const generateMetadata = async ({
  params: _params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata | undefined> => {
  try {
    const params = await _params;
    const data = await basehub().query({
      site: {
        settings: { metadata: { defaultTitle: true, titleTemplate: true, defaultDescription: true } },
        pages: {
          __args: {
            filter: {
              pathname: {
                eq: params.slug ? `/${params.slug.join("/")}` : "/",
              },
            },
          },
          items: {
            metadataOverrides: {
              title: true,
              description: true,
            },
          },
        },
      },
    });

    const page = data.site.pages.items.at(0);

    if (!page) {
      return notFound();
    }

    return {
      title: page.metadataOverrides.title ?? data.site.settings.metadata.defaultTitle,
      description:
        page.metadataOverrides.description ?? data.site.settings.metadata.defaultDescription,
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    // Return mock metadata as fallback
    const params = await _params;
    const path = params.slug ? `/${params.slug.join("/")}` : "/";
    const mockPage = mockData.site.pages.items.find(p => p.pathname === path);
    
    return {
      title: mockPage ? `${mockPage.pathname.slice(1) || 'Home'} | Marketing Website` : "Marketing Website",
      description: "A modern marketing website built with Next.js and Basehub",
    };
  }
};

function SectionsUnion({
  sections,
  eventsKey,
  settings,
}: {
  sections: fragmentOn.infer<typeof sectionsFragment>["sections"];
  eventsKey: GeneralEvents["ingestKey"];
  settings: SettingsLogoLiteFragment;
}): React.ReactNode {
  if (!sections) return null;

  return sections.map((comp) => {
    switch (comp.__typename) {
      case "HeroComponent":
        return <Hero {...comp} key={comp._id} eventsKey={eventsKey} />;
      case "FeaturesCardsComponent":
        return <FeaturesList {...comp} key={comp._id} />;
      case "FeaturesGridComponent":
        return <FeaturesGrid {...comp} key={comp._id} eventsKey={eventsKey} />;
      case "CompaniesComponent":
        return <Companies {...comp} key={comp._id} />;
      case "FeaturesBigImageComponent":
        return <BigFeature {...comp} key={comp._id} />;
      case "FeaturesSideBySideComponent":
        return <SideFeatures {...comp} key={comp._id} eventsKey={eventsKey} />;
      case "CalloutComponent":
        return <Callout {...comp} key={comp._id} eventsKey={eventsKey} />;
      case "CalloutV2Component":
        return <Callout2 {...comp} key={comp._id} eventsKey={eventsKey} />;
      case "TestimonialSliderComponent":
        return <Testimonials {...comp} key={comp._id} />;
      case "TestimonialsGridComponent":
        return <TestimonialsGrid {...comp} key={comp._id} />;
      case "PricingComponent":
        return <Pricing {...comp} key={comp._id} />;
      case "FaqComponent":
        return <Faq {...comp} key={comp._id} />;
      case "AccordionFaqComponent":
        return <AccordionFaq {...comp} key={comp._id} eventsKey={eventsKey} />;
      case "PricingTableComponent":
        return <PricingTable {...comp} key={comp._id} />;
      case "FeatureHeroComponent":
        return <FeatureHero {...comp} key={comp._id} eventsKey={eventsKey} />;
      case "FreeformTextComponent":
        return <FreeformText {...comp} key={comp._id} />;
      case "FormComponent":
        return <Form {...comp} key={comp._id} settingsLogoLite={settings} />;
      default:
        return null;
    }
  });
}

const sectionsFragment = fragmentOn("PagesItem", {
  sections: {
    __typename: true,
    on_BlockDocument: { _id: true },
    on_HeroComponent: heroFragment,
    on_FeaturesCardsComponent: featureCardsComponent,
    on_FeaturesSideBySideComponent: featuresSideBySideFragment,
    on_FeaturesBigImageComponent: bigFeatureFragment,
    on_FeaturesGridComponent: featuresGridFragment,
    on_CompaniesComponent: companiesFragment,
    on_CalloutComponent: calloutFragment,
    on_CalloutV2Component: calloutv2Fragment,
    on_TestimonialSliderComponent: testimonialsSliderFragment,
    on_TestimonialsGridComponent: testimonialsGridFragment,
    on_PricingComponent: pricingFragment,
    on_PricingTableComponent: pricingTableFragment,
    on_FeatureHeroComponent: featureHeroFragment,
    on_FaqComponent: {
      layout: true,
      ...faqFragment,
    },
    on_FreeformTextComponent: freeformTextFragment,
    on_FormComponent: formFragment,
  },
});

export default async function DynamicPage({
  params: _params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  try {
    const params = await _params;
    const slugs = params.slug;

    const {
      site: { pages, generalEvents, settings },
    } = await basehub().query({
      site: {
        settings: { ...settingsLogoLiteFragment },
        pages: {
          __args: {
            filter: {
              pathname: {
                eq: slugs ? `/${slugs.join("/")}` : "/",
              },
            },
          },
          items: {
            _analyticsKey: true,
            _id: true,
            pathname: true,
            sections: sectionsFragment.sections,
          },
        },
        generalEvents: {
          ingestKey: true,
        },
      },
    });

    const page = pages.items[0];

    if (!page) notFound();

    const sections = page.sections;

    return (
      <>
        <PageView ingestKey={generalEvents.ingestKey} />
        <SectionsUnion sections={sections} eventsKey={generalEvents.ingestKey} settings={settings} />
      </>
    );
  } catch (error) {
    console.error("Error in DynamicPage:", error);
    // Use mock data for local development
    const params = await _params;
    const path = params.slug ? `/${params.slug.join("/")}` : "/";
    const mockPage = mockData.site.pages.items.find(p => p.pathname === path);
    
    if (!mockPage) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <PageView ingestKey={mockData.site.generalEvents.ingestKey} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Demo Mode</h1>
            <p className="text-gray-600 mb-4">This is a demo page for: {mockPage.pathname}</p>
            <p className="text-sm text-gray-500">
              To see real content, add your BASEHUB_TOKEN to .env.local
            </p>
          </div>
        </div>
      </>
    );
  }
}

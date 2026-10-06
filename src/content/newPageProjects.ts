import { projects as homepageProjects, type Locale } from "@/content/home";
import { investmentContent } from "@/content/investment";

// The two new page designs present the same projects in different sequences.
// Keep this explicit mapping so the copy can be exchanged without changing
// either page's visual order, images, logos, portfolio tabs, or CTAs.
const homeToInvestment = [0, 5, 1, 3, 2, 10, 6, 9, 11, 4, 7, 8];
const investmentToHome = [0, 2, 4, 3, 9, 1, 6, 10, 11, 7, 5, 8];

// Client-approved copy for the new English homepage only, in homepage slide order.
const newHomepageEnglishDescriptions = [
  "A high-level government event focused on anticipating the future of maritime security and protecting vital maritime routes and supply chains amid rapid global shifts. It embodies the Kingdom of Saudi Arabia’s strategic role in strengthening maritime security and safeguarding critical surface and subsea infrastructure.",
  "A specialized international exhibition that brings together innovation and the manufacturing of autonomous and semi-autonomous system components under one roof, accelerating innovation, investment, and the localization of artificial intelligence technologies and applications that are shaping the future of the world.",
  "A specialized Saudi international platform dedicated to anticipating the future of multi-domain defense readiness. It brings together military leaders, decision-makers, and global experts to discuss the latest concepts, applications, and technologies in command-and-control systems, operational awareness, artificial intelligence, and multi-domain operations, thereby supporting defense readiness and strengthening the armed forces’ ability to make decisions and achieve operational superiority in complex and evolving environments.",
  "A platform that harnesses Saudi Arabia’s marine resources by highlighting blue economy opportunities across energy, transport, tourism, and food security. It brings the objectives of Saudi Vision 2030 to life by supporting economic diversification, strengthening environmental sustainability, and transforming Saudi coastlines into promising drivers of development and economic growth.",
  "A specialized international exhibition that showcases the latest solutions, technologies, and practices in industrial security, risk management, and the protection of critical assets and facilities, contributing to higher levels of safety, operational readiness, and sustainability across strategic sectors.",
  "A leading national platform that supports women’s empowerment and strengthens their role in economic and social development through strategic partnerships, knowledge exchange, and the promotion of success stories and opportunities that contribute to developing female leadership and advancing entrepreneurship.",
  "A specialized platform that brings together industry leaders, investors, and technology developers to showcase the latest innovations in the semiconductor sector, accelerate knowledge transfer, localize advanced technologies, and enhance Saudi Arabia’s readiness to participate in global technology value chains.",
  "An international platform showcasing the future of smart cities and sustainable urban planning. It brings together experts, solution providers, and relevant stakeholders to develop urban environments that are more efficient and sustainable, offer a higher quality of life, and are powered by the latest automation and digital transformation technologies.",
  "A specialized national platform dedicated to promoting the concepts of prevention, sustainable health, and quality of life. It brings together experts, practitioners, and decision-makers to showcase best practices and innovations that contribute to building a healthier and more productive society, while supporting Saudi Arabia’s objectives to develop the healthcare sector and improve quality of life.",
  "A specialized platform that brings together regulatory authorities, experts, and solution providers to discuss the future of oil pollution response and marine environmental risk management, thereby strengthening national preparedness, protecting natural resources, supporting environmental sustainability objectives, and preserving marine and coastal ecosystems in Saudi Arabia.",
  "A specialized platform that supports the growth of the mining sector by showcasing the latest technologies, investment opportunities, and operational solutions, while fostering collaboration between investors, operators, and technology providers to maximize the value of mineral resources and support economic diversification objectives.",
  "A specialized platform dedicated to strengthening the security and sustainability of pharmaceutical and medical supply chains by bringing together regulators, manufacturers, solution providers, and industry experts. The exhibition supports the localization of pharmaceutical, medical supply, and medical device industries, advances national capabilities, and enhances the readiness of the healthcare sector to address future challenges and strengthen national health security.",
];

const flattenedInvestmentProjects = (locale: Locale) =>
  investmentContent[locale].projects.portfolios.flatMap((portfolio) => portfolio.items);

export function getNewHomepageProjects(useClientEnglishCopy = false) {
  const englishInvestmentProjects = flattenedInvestmentProjects("en");
  const arabicInvestmentProjects = flattenedInvestmentProjects("ar");

  return homepageProjects.map((project, homeIndex) => {
    const investmentIndex = homeToInvestment[homeIndex];
    const english = englishInvestmentProjects[investmentIndex];
    const arabic = arabicInvestmentProjects[investmentIndex];

    return {
      ...project,
      portfolio: investmentIndex < 5 ? "government" : investmentIndex < 10 ? "business" : "community",
      investmentIndex,
      title: english.title,
      ar: arabic.title,
      description: useClientEnglishCopy ? newHomepageEnglishDescriptions[homeIndex] : english.body,
      arDescription: arabic.body,
    };
  });
}

export function getNewInvestmentPortfolios(locale: Locale) {
  let investmentIndex = 0;

  return investmentContent[locale].projects.portfolios.map((portfolio) => ({
    ...portfolio,
    items: portfolio.items.map((project) => {
      const homepageProject = homepageProjects[investmentToHome[investmentIndex]];
      investmentIndex += 1;

      return {
        ...project,
        title: locale === "ar" ? homepageProject.ar : homepageProject.title,
        body: locale === "ar" ? homepageProject.arDescription : homepageProject.description,
      };
    }),
  }));
}

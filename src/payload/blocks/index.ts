import type { Block } from "payload";
import { CredibilityBlock } from "./CredibilityBlock";
import { CardGridBlock } from "./CardGridBlock";
import { CallToActionBlock } from "./CallToActionBlock";
import { FormBlock } from "./FormBlock";
import { HeroBlock } from "./HeroBlock";
import { ImageStoryBlock } from "./ImageStoryBlock";
import { MediaFeatureBlock } from "./MediaFeatureBlock";
import { MapBlock } from "./MapBlock";
import { LogoMarqueeBlock } from "./LogoMarqueeBlock";
import { NewsMosaicBlock } from "./NewsMosaicBlock";
import { ProjectShowcaseBlock } from "./ProjectShowcaseBlock";
import { RichTextBlock } from "./RichTextBlock";
import { TimelineBlock } from "./TimelineBlock";
import { NewHomepageOpeningBlock } from "./NewHomepageOpeningBlock";
import { NewHomepageValueBlock } from "./NewHomepageValueBlock";
import { NewHomepageDomainsBlock } from "./NewHomepageDomainsBlock";
import { NewHomepagePortfoliosBlock } from "./NewHomepagePortfoliosBlock";
import { NewHomepageImpactBlock } from "./NewHomepageImpactBlock";
import { NewHomepageProjectsBlock } from "./NewHomepageProjectsBlock";
import { HomepageMembershipBlock, HomepagePanoramaBlock, newSiteSectionBlocks } from "./newSiteSections";

export const pageBlocks: Block[] = [
  NewHomepageOpeningBlock,
  NewHomepageValueBlock,
  NewHomepageDomainsBlock,
  NewHomepagePortfoliosBlock,
  NewHomepageImpactBlock,
  NewHomepageProjectsBlock,
  HomepagePanoramaBlock,
  HomepageMembershipBlock,
  ...newSiteSectionBlocks,
  HeroBlock,
  CredibilityBlock,
  LogoMarqueeBlock,
  CardGridBlock,
  ProjectShowcaseBlock,
  MediaFeatureBlock,
  MapBlock,
  ImageStoryBlock,
  NewsMosaicBlock,
  TimelineBlock,
  RichTextBlock,
  FormBlock,
  CallToActionBlock,
];

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

export const pageBlocks: Block[] = [
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

import type { PuckComponent } from "@puckeditor/core";
import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { createCta } from "../cta";
import {
  ComprehensiveCTA,
  EntityField,
  MaybeRTF,
  createItemSource,
  getAnalyticsScopeHash,
  getDefaultRTF,
  resolveComponentData,
  toPuckFields,
  useDocument,
  type ComprehensiveCTAValue,
  type RichText,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  VisibilityWrapper,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type MenuImageProps = {
  image: YextEntityField<TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type MenuItemProps = {
  title: StyledTextProps;
  category: StyledTextProps;
  description: StyledRtfProps;
  image: MenuImageProps;
  cta: ComprehensiveCTAValue;
};

const createMenuCardCta = (label: string) =>
  createCta(label, {
    color: { selectedColor: "[#171219]", contrastingColor: "white" },
    variant: "secondary",
  });

const menuItemsSource = createItemSource<MenuItemProps>({
  label: "Menu Items",
  mappingFields: {
    title: {
      label: "Title",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    category: {
      label: "Category",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    description: {
      label: "Description",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.rich_text_v2"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    image: {
      label: "Image",
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: "Image",
          filter: {
            types: ["type.image"],
          },
        },
        aspectRatio: {
          label: "Aspect Ratio",
          type: "number",
        },
        imageConstrain: {
          label: "Image Constrain",
          type: "select",
          options: [
            { label: "Fixed", value: "fixed" },
            { label: "Filled", value: "filled" },
          ],
        },
        styles: {
          label: "Image Styles",
          type: "styledImage",
        },
      },
    },
    cta: {
      label: "Call to Action",
      type: "comprehensiveCTA",
    },
  },
  defaultValues: [
    {
      title: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Redwood Smokehouse Burger",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      category: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Burgers",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      description: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "A wood-fired double smash burger topped with smoked cheddar, crispy onions, bourbon bacon jam, arugula, and house redwood sauce on a toasted brioche bun. Served with hand-cut fries.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      image: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 0.9,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
      cta: createMenuCardCta("Learn More"),
    },
    {
      title: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "South Lamar Chicken Sandwich",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      category: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Sandwiches",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      description: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Crispy buttermilk fried chicken layered with hot honey glaze, dill pickles, shredded lettuce, and chipotle aioli on a buttered potato bun. A local favorite during happy hour and weekend brunch.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      image: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 0.9,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
      cta: createMenuCardCta("Learn More"),
    },
    {
      title: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Hill Country Steak Salad",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      category: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Salads",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      description: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Grilled skirt steak served over mixed greens with roasted corn, avocado, pickled red onions, cotija cheese, tortilla strips, and cilantro-lime vinaigrette. Fresh, hearty, and distinctly Texas-inspired.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      image: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 0.9,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
      cta: createMenuCardCta("Learn More"),
    },
  ],
});

type YextBarSocialDiningMenuSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  cardBackgroundColor: ThemeColor;
  mediaFrameBackgroundColor: ThemeColor;
  items: typeof menuItemsSource.value;
};

const themeColorToCss = (selectedColor?: string): string | undefined => {
  if (!selectedColor) {
    return undefined;
  }

  if (selectedColor.startsWith("[") && selectedColor.endsWith("]")) {
    return selectedColor.slice(1, -1);
  }

  const paletteMap: Record<string, string> = {
    white: "#ffffff",
    "palette-primary": "var(--colors-palette-primary)",
    "palette-secondary": "var(--colors-palette-secondary)",
    "palette-tertiary": "var(--colors-palette-tertiary)",
    "palette-quaternary": "var(--colors-palette-quaternary)",
    "palette-primary-contrast": "var(--colors-palette-primary-contrast)",
    "palette-secondary-contrast": "var(--colors-palette-secondary-contrast)",
    "palette-tertiary-contrast": "var(--colors-palette-tertiary-contrast)",
    "palette-quaternary-contrast": "var(--colors-palette-quaternary-contrast)",
    "palette-primary-light": "hsl(from var(--colors-palette-primary) h s 98)",
    "palette-secondary-light":
      "hsl(from var(--colors-palette-secondary) h s 98)",
    "palette-tertiary-light": "hsl(from var(--colors-palette-tertiary) h s 98)",
    "palette-quaternary-light":
      "hsl(from var(--colors-palette-quaternary) h s 98)",
    "palette-primary-dark": "hsl(from var(--colors-palette-primary) h s 20)",
    "palette-secondary-dark":
      "hsl(from var(--colors-palette-secondary) h s 20)",
  };

  return paletteMap[selectedColor] ?? selectedColor;
};

const hasExplicitThemeColor = (color?: ThemeColor): color is ThemeColor => {
  return Boolean(color?.selectedColor && color.selectedColor !== "default");
};

const getReadableForegroundColor = (surfaceColor: ThemeColor): ThemeColor => {
  switch (surfaceColor.selectedColor) {
    case "white":
    case "palette-primary-light":
    case "palette-secondary-light":
    case "palette-tertiary-light":
    case "palette-quaternary-light":
      return {
        selectedColor: "black",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "black":
    case "palette-primary-dark":
    case "palette-secondary-dark":
      return {
        selectedColor: "white",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-primary":
      return {
        selectedColor: "palette-primary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-secondary":
      return {
        selectedColor: "palette-secondary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-tertiary":
      return {
        selectedColor: "palette-tertiary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-quaternary":
      return {
        selectedColor: "palette-quaternary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    default:
      return {
        selectedColor: surfaceColor.contrastingColor || "black",
        contrastingColor: surfaceColor.selectedColor,
      };
  }
};

const resolveTextColor = (
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
): string | undefined => {
  return themeColorToCss(
    (hasExplicitThemeColor(fontColor)
      ? fontColor
      : getReadableForegroundColor(surfaceColor)
    ).selectedColor,
  );
};

const resolveRichTextValue = (
  value: unknown,
): RichText | string | undefined => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && value !== null && "html" in value) {
    return value as RichText;
  }

  return undefined;
};

const renderRichText = (value: unknown): React.ReactNode => {
  if (React.isValidElement(value)) {
    return value;
  }

  return <MaybeRTF data={resolveRichTextValue(value)} />;
};

const menuScopeClass = "bar-social-dining-menu";
const menuScopedTypographyCss = `
  .${menuScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${menuScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${menuScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  .${menuScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  .${menuScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  .${menuScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  .${menuScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  .${menuScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  .${menuScopeClass} .bar-social-dining-link-typography a {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: underline;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
`;

const textStyle = (
  styles: StyledTextValue,
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
): React.CSSProperties => ({
  color: resolveTextColor(fontColor, surfaceColor),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

const YextBarSocialDiningMenuSectionFields =
  toPuckFields<YextBarSocialDiningMenuSectionProps>({
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    heading: {
      label: "Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    mediaFrameBackgroundColor: {
      label: "Media Frame Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    items: menuItemsSource.field,
  });

const YextBarSocialDiningMenuSectionComponent: PuckComponent<
  YextBarSocialDiningMenuSectionProps
> = ({ id, ...props }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const resolvedHeading = resolveComponentData(
    props.heading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const items = menuItemsSource.resolveItems(
    props.items as unknown as typeof menuItemsSource.value,
    streamDocument,
  );

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextBarSocialDiningMenuSection${getAnalyticsScopeHash(id)}`}
      >
        <style>{menuScopedTypographyCss}</style>
        <section
          className={menuScopeClass}
          style={{
            backgroundColor: themeColorToCss(
              props.section.backgroundColor.selectedColor,
            ),
            padding: "72px 24px",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: "var(--maxWidth-pageSection-contentWidth, 1200px)",
            }}
          >
            <div style={{ marginBottom: "32px", textAlign: "center" }}>
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  style={{
                    ...textStyle(
                      props.heading.styles,
                      props.heading.fontColor,
                      props.section.backgroundColor,
                    ),
                    margin: 0,
                  }}
                >
                  {typeof resolvedHeading === "string" ? resolvedHeading : ""}
                </h2>
              </EntityField>
            </div>
            <EntityField
              displayName="Menu Items"
              fieldId={props.items.field}
              constantValueEnabled={props.items.constantValueEnabled}
            >
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  overflowX: "auto",
                }}
              >
                {items.map((item, index) => {
                  const resolvedTitle = resolveComponentData(
                    item.title.text as TranslatableString,
                    locale,
                    streamDocument,
                    { output: "plainText" },
                  );
                  const resolvedCategory = resolveComponentData(
                    item.category.text as TranslatableString,
                    locale,
                    streamDocument,
                    { output: "plainText" },
                  );
                  const resolvedDescription = resolveComponentData(
                    item.description.text as TranslatableRichText,
                    locale,
                    streamDocument,
                  );
                  const resolvedImage = resolveComponentData(
                    item.image.image as TranslatableAssetImage,
                    locale,
                    streamDocument,
                  );
                  const resolvedImageUrl =
                    typeof resolvedImage === "object" &&
                    resolvedImage !== null &&
                    "url" in resolvedImage
                      ? String(resolvedImage.url)
                      : "";
                  const fallbackCta = props.items.constantValue?.[index]
                    ?.cta as Partial<ComprehensiveCTAValue> | undefined;
                  const resolvedAspectRatio =
                    typeof item.image.aspectRatio === "number" &&
                    item.image.aspectRatio > 0
                      ? item.image.aspectRatio
                      : 0.9;
                  const hasCardImage = Boolean(resolvedImageUrl);
                  return (
                    <article
                      key={`${resolvedTitle ?? "item"}-${index}`}
                      style={{
                        backgroundColor: themeColorToCss(
                          props.cardBackgroundColor.selectedColor,
                        ),
                        border: "1px solid rgba(23, 18, 25, 0.85)",
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "240px",
                      }}
                    >
                      <div
                        style={{
                          alignItems: "center",
                          backgroundColor: hasCardImage
                            ? themeColorToCss(
                                props.mediaFrameBackgroundColor.selectedColor,
                              )
                            : undefined,
                          display: "flex",
                          aspectRatio: resolvedAspectRatio,
                          justifyContent: "center",
                          overflow: "hidden",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            height: "74%",
                            overflow:
                              hasCardImage && item.image.imageConstrain === "filled"
                                ? "hidden"
                                : undefined,
                            width: "74%",
                          }}
                        >
                          {hasCardImage ? (
                            item.image.imageConstrain === "filled" ? (
                              <img
                                alt={
                                  typeof resolvedTitle === "string"
                                    ? resolvedTitle
                                    : ""
                                }
                                src={resolvedImageUrl}
                                style={{
                                  display: "block",
                                  height: "100%",
                                  objectFit: "cover",
                                  objectPosition: "center",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <img
                                alt={
                                  typeof resolvedTitle === "string"
                                    ? resolvedTitle
                                    : ""
                                }
                                src={resolvedImageUrl}
                                style={{
                                  display: "block",
                                  height: "100%",
                                  objectFit: "contain",
                                  objectPosition: "center",
                                  width: "100%",
                                }}
                              />
                            )
                          ) : null}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                          padding: "18px 18px 20px",
                          textAlign: "center",
                        }}
                      >
                        <h3
                          style={{
                            ...textStyle(
                              item.title.styles,
                              item.title.fontColor,
                              props.cardBackgroundColor,
                            ),
                            margin: 0,
                          }}
                        >
                          {typeof resolvedTitle === "string"
                            ? resolvedTitle
                            : ""}
                        </h3>
                        <p
                          style={{
                            ...textStyle(
                              item.category.styles,
                              item.category.fontColor,
                              props.cardBackgroundColor,
                            ),
                            margin: "2px 0 0",
                          }}
                        >
                          {typeof resolvedCategory === "string"
                            ? resolvedCategory
                            : ""}
                        </p>
                        <div
                          className="bar-social-dining-link-typography"
                          style={{
                            ...textStyle(
                              item.description.styles,
                              item.description.fontColor,
                              props.cardBackgroundColor,
                            ),
                            flexGrow: 1,
                            margin: "16px 0 12px",
                          }}
                        >
                          {renderRichText(resolvedDescription)}
                        </div>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <ComprehensiveCTA
                            value={fallbackCta}
                            eventName={`cardCta-${index}`}
                            style={{ margin: "0 auto" }}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </EntityField>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningMenuSection: YextComponentConfig<YextBarSocialDiningMenuSectionProps> =
  {
    label: "Menu Section",
    fields: YextBarSocialDiningMenuSectionFields,
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "[#171219]",
        },
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Featured Menu Items at South Lamar",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      cardBackgroundColor: {
        selectedColor: "white",
        contrastingColor: "[#171219]",
      },
      mediaFrameBackgroundColor: {
        selectedColor: "[#d9c4a0]",
        contrastingColor: "[#171219]",
      },
      items: menuItemsSource.defaultValue,
    },
    render: (props) => <YextBarSocialDiningMenuSectionComponent {...props} />,
  };

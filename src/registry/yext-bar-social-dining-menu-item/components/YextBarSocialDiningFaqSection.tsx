import { useState } from "react";
import type { PuckComponent } from "@puckeditor/core";
import * as React from "react";
import { AnalyticsScopeProvider, useAnalytics } from "@yext/pages-components";
import {
  EntityField,
  Image,
  MaybeRTF,
  getAnalyticsScopeHash,
  getDefaultRTF,
  resolveComponentData,
  useDocument,
  type RichText,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
  toPuckFields,
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

type FaqImageProps = {
  image: YextEntityField<TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type FaqItem = {
  question: StyledTextProps;
  answer: StyledRtfProps;
  image: FaqImageProps;
};

type YextBarSocialDiningFaqSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  questionBackgroundColor: ThemeColor;
  answerBackgroundColor: ThemeColor;
  items: FaqItem[];
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

const faqScopeClass = "bar-social-dining-faq";
const faqScopedTypographyCss = `
  .${faqScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${faqScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${faqScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  .${faqScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  .${faqScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  .${faqScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  .${faqScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  .${faqScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  .${faqScopeClass} .bar-social-dining-link-typography a {
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

const YextBarSocialDiningFaqSectionFields: YextFields<YextBarSocialDiningFaqSectionProps> =
  {
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
    questionBackgroundColor: {
      label: "Question Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    answerBackgroundColor: {
      label: "Answer Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    items: {
      label: "Items",
      type: "array",
      arrayFields: {
        question: {
          label: "Question",
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
        answer: {
          label: "Answer",
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
      },
      defaultItemProps: {
        question: {
          text: {
            field: "",
            constantValue: {
              defaultValue: "Question",
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
        answer: {
          text: {
            field: "",
            constantValue: {
              defaultValue: getDefaultRTF("Answer"),
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
              url: "",
              width: 0,
              height: 0,
            },
            constantValueEnabled: true,
          },
          aspectRatio: 1,
          imageConstrain: "fixed",
          styles: {
            borderRadius: "default",
          },
        },
      },
      getItemSummary: (item) =>
        (typeof item.question?.text?.constantValue === "object" &&
        item.question?.text?.constantValue !== null &&
        "defaultValue" in item.question.text.constantValue
          ? item.question.text.constantValue.defaultValue
          : typeof item.question?.text?.constantValue === "string"
            ? item.question.text.constantValue
            : "") ||
        item.question?.text?.field ||
        "FAQ",
    },
  };

const YextBarSocialDiningFaqSectionComponent: PuckComponent<
  YextBarSocialDiningFaqSectionProps
> = ({ id, ...props }) => {
  const analytics = useAnalytics();
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const questionForeground = resolveTextColor(
    undefined,
    props.questionBackgroundColor,
  );
  const answerForeground = resolveTextColor(
    undefined,
    props.answerBackgroundColor,
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const resolvedHeading = resolveComponentData(
    props.heading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextBarSocialDiningFaqSection${getAnalyticsScopeHash(id)}`}
      >
        <style>{`
            ${faqScopedTypographyCss}

            .bar-social-dining-faq-grid {
              display: grid;
              gap: 16px;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              max-width: 100%;
            }

            @media (max-width: 1024px) {
              .bar-social-dining-faq-grid {
                grid-template-columns: 1fr;
              }

              .bar-social-dining-faq-card {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        <section
          className={faqScopeClass}
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
            <div className="bar-social-dining-faq-grid">
              {(props.items ?? []).map((item, index) => {
                const isOpen = openIndex === index;
                const resolvedQuestion = resolveComponentData(
                  item.question.text,
                  locale,
                  streamDocument,
                  { output: "plainText" },
                );
                const resolvedAnswer = resolveComponentData(
                  item.answer.text,
                  locale,
                  streamDocument,
                );
                const resolvedImage = resolveComponentData(
                  item.image.image,
                  locale,
                  streamDocument,
                );
                const resolvedImageUrl =
                  typeof resolvedImage === "object" &&
                  resolvedImage !== null &&
                  "url" in resolvedImage &&
                  typeof resolvedImage.url === "string"
                    ? resolvedImage.url.trim()
                    : typeof resolvedImage === "object" &&
                        resolvedImage !== null &&
                        "image" in resolvedImage &&
                        resolvedImage.image &&
                        typeof resolvedImage.image === "object" &&
                        "url" in resolvedImage.image &&
                        typeof resolvedImage.image.url === "string"
                      ? resolvedImage.image.url.trim()
                      : "";
                const hasAnswerImage = Boolean(resolvedImageUrl);
                const answerImage = hasAnswerImage
                  ? (resolvedImage as TranslatableAssetImage)
                  : undefined;
                const hasAnswerPanel = isOpen || hasAnswerImage;

                return (
                  <div
                    className="bar-social-dining-faq-card"
                    key={`${item.question.text.field}-${index}`}
                    style={{
                      border: "1px solid rgba(23, 18, 25, 0.08)",
                      display: "grid",
                      gridTemplateColumns: hasAnswerPanel ? "1fr 1fr" : "1fr",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => {
                        const nextIndex = isOpen ? null : index;
                        setOpenIndex(nextIndex);
                        analytics?.track({
                          action: nextIndex === null ? "COLLAPSE" : "EXPAND",
                          eventName: `toggle${index}`,
                        });
                      }}
                      style={{
                        backgroundColor: themeColorToCss(
                          props.questionBackgroundColor.selectedColor,
                        ),
                        border: 0,
                        color: questionForeground,
                        cursor: "pointer",
                        minHeight: "180px",
                        padding: "24px",
                        textAlign: "left",
                      }}
                      type="button"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "18px",
                          height: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <EntityField
                          displayName="Question"
                          fieldId={item.question.text.field}
                          constantValueEnabled={
                            item.question.text.constantValueEnabled
                          }
                        >
                          <h3
                            style={{
                              ...textStyle(
                                item.question.styles,
                                item.question.fontColor,
                                props.questionBackgroundColor,
                              ),
                              margin: 0,
                            }}
                          >
                            {typeof resolvedQuestion === "string"
                              ? resolvedQuestion
                              : ""}
                          </h3>
                        </EntityField>
                        <span style={{ fontSize: "1.5rem" }}>
                          {isOpen ? "«" : "»"}
                        </span>
                      </div>
                    </button>
                    {hasAnswerPanel ? (
                      <div
                        style={{
                          alignItems: "center",
                          backgroundColor: themeColorToCss(
                            props.answerBackgroundColor.selectedColor,
                          ),
                          color: answerForeground,
                          display: "flex",
                          justifyContent: "center",
                          minHeight: "180px",
                          padding: "24px",
                        }}
                      >
                        {isOpen ? (
                          <EntityField
                            displayName="Answer"
                            fieldId={item.answer.text.field}
                            constantValueEnabled={
                              item.answer.text.constantValueEnabled
                            }
                          >
                            <div
                              className="bar-social-dining-link-typography"
                              style={{
                                ...textStyle(
                                  item.answer.styles,
                                  item.answer.fontColor,
                                  props.answerBackgroundColor,
                                ),
                                margin: 0,
                              }}
                            >
                              {renderRichText(resolvedAnswer)}
                            </div>
                          </EntityField>
                        ) : hasAnswerImage ? (
                          <EntityField
                            displayName="Image"
                            fieldId={item.image.image.field}
                            constantValueEnabled={
                              item.image.image.constantValueEnabled
                            }
                          >
                            <div
                              style={{
                                aspectRatio:
                                  item.image.aspectRatio > 0
                                    ? item.image.aspectRatio
                                    : undefined,
                                maxWidth: "120px",
                                overflow:
                                  item.image.imageConstrain === "filled"
                                    ? "hidden"
                                    : undefined,
                                width: "100%",
                              }}
                            >
                              <Image
                                image={answerImage!}
                                style={{
                                  height:
                                    item.image.aspectRatio > 0 ? "100%" : "auto",
                                  objectFit:
                                    item.image.imageConstrain === "filled"
                                      ? "cover"
                                      : "contain",
                                  width: "100%",
                                }}
                              />
                            </div>
                          </EntityField>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningFaqSection: YextComponentConfig<YextBarSocialDiningFaqSectionProps> =
  {
    label: "FAQ Section",
    fields: toPuckFields(YextBarSocialDiningFaqSectionFields),
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
            defaultValue: "FAQs",
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
      questionBackgroundColor: {
        selectedColor: "palette-secondary",
        contrastingColor: "[#171219]",
      },
      answerBackgroundColor: {
        selectedColor: "[#f6eee7]",
        contrastingColor: "[#171219]",
      },
      items: [
        {
          question: {
            text: {
              field: "",
              constantValue: {
                defaultValue:
                  "Are your dining hours the same as your take-out hours?",
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
          answer: {
            text: {
              field: "",
              constantValue: {
                defaultValue: getDefaultRTF(
                  "Not always. Our takeout and delivery service may remain available slightly later than dine-in seating, especially on weekends. For the most accurate hours, we recommend checking our online ordering page or giving our South Lamar location a quick call before placing your order.",
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
                url: "https://a.mktgcdn.com/p/hlcJpcdE-_vHprzl5MOnrTwEFmdYZRE9WaT_drjPWis/1000x568.png",
                width: 1000,
                height: 568,
              },
              constantValueEnabled: true,
            },
            aspectRatio: 1,
            imageConstrain: "fixed",
            styles: {
              borderRadius: "default",
            },
          },
        },
        {
          question: {
            text: {
              field: "",
              constantValue: {
                defaultValue: "Can I order online?",
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
          answer: {
            text: {
              field: "",
              constantValue: {
                defaultValue: getDefaultRTF(
                  "Yes. You can place pickup or delivery orders online for lunch, dinner, and brunch service. Online ordering is the fastest way to browse current menu availability, add notes, and choose your preferred pickup time.",
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
                url: "https://a.mktgcdn.com/p/0V-U0Tk9g5iHSg5ONJZW00L2_BGDVymefN7fqI051qE/1000x568.png",
                width: 1000,
                height: 568,
              },
              constantValueEnabled: true,
            },
            aspectRatio: 1,
            imageConstrain: "fixed",
            styles: {
              borderRadius: "default",
            },
          },
        },
        {
          question: {
            text: {
              field: "",
              constantValue: {
                defaultValue: "Does this location take reservations?",
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
          answer: {
            text: {
              field: "",
              constantValue: {
                defaultValue: getDefaultRTF(
                  "Reservations are available through OpenTable for most lunch, dinner, and brunch seatings. Walk-ins are always welcome, but booking ahead is the best option for weekends, larger parties, and group celebrations.",
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
                url: "https://a.mktgcdn.com/p/IBzkFIQfMJfgyQi-wxH0LQqlhxZD687Qelcs5dAr1U4/1000x568.png",
                width: 1000,
                height: 568,
              },
              constantValueEnabled: true,
            },
            aspectRatio: 1,
            imageConstrain: "fixed",
            styles: {
              borderRadius: "default",
            },
          },
        },
        {
          question: {
            text: {
              field: "",
              constantValue: {
                defaultValue: "Do you have a kids menu?",
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
          answer: {
            text: {
              field: "",
              constantValue: {
                defaultValue: getDefaultRTF(
                  "We do. Our kids options are built around smaller portions of guest favorites like cheeseburgers, fries, grilled chicken, and simple sides, making it easy for families to enjoy brunch or dinner together.",
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
                url: "https://a.mktgcdn.com/p/hlcJpcdE-_vHprzl5MOnrTwEFmdYZRE9WaT_drjPWis/1000x568.png",
                width: 1000,
                height: 568,
              },
              constantValueEnabled: true,
            },
            aspectRatio: 1,
            imageConstrain: "fixed",
            styles: {
              borderRadius: "default",
            },
          },
        },
        {
          question: {
            text: {
              field: "",
              constantValue: {
                defaultValue: "Do you serve brunch?",
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
          answer: {
            text: {
              field: "",
              constantValue: {
                defaultValue: getDefaultRTF(
                  "Yes. South Lamar serves weekend brunch with savory burger plates, chicken sandwiches, brunch cocktails, coffee, and lighter options. It’s one of our busiest services, so arriving early or reserving ahead is recommended.",
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
                url: "https://a.mktgcdn.com/p/0V-U0Tk9g5iHSg5ONJZW00L2_BGDVymefN7fqI051qE/1000x568.png",
                width: 1000,
                height: 568,
              },
              constantValueEnabled: true,
            },
            aspectRatio: 1,
            imageConstrain: "fixed",
            styles: {
              borderRadius: "default",
            },
          },
        },
        {
          question: {
            text: {
              field: "",
              constantValue: {
                defaultValue: "Do you have outdoor seating?",
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
          answer: {
            text: {
              field: "",
              constantValue: {
                defaultValue: getDefaultRTF(
                  "Yes. Patio seating is available for guests who want an open-air South Austin dining experience. Patio availability can vary with weather and private events, so calling ahead is helpful if outdoor seating is your preference.",
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
                url: "https://a.mktgcdn.com/p/IBzkFIQfMJfgyQi-wxH0LQqlhxZD687Qelcs5dAr1U4/1000x568.png",
                width: 1000,
                height: 568,
              },
              constantValueEnabled: true,
            },
            aspectRatio: 1,
            imageConstrain: "fixed",
            styles: {
              borderRadius: "default",
            },
          },
        },
        {
          question: {
            text: {
              field: "",
              constantValue: {
                defaultValue: "Do you offer vegetarian or gluten-free options?",
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
          answer: {
            text: {
              field: "",
              constantValue: {
                defaultValue: getDefaultRTF(
                  "We do. The menu includes salads, sides, and customizable mains that work well for vegetarian or gluten-conscious guests. Because kitchens handle multiple ingredients, we recommend speaking with the team when ordering for the best guidance.",
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
                url: "https://a.mktgcdn.com/p/hlcJpcdE-_vHprzl5MOnrTwEFmdYZRE9WaT_drjPWis/1000x568.png",
                width: 1000,
                height: 568,
              },
              constantValueEnabled: true,
            },
            aspectRatio: 1,
            imageConstrain: "fixed",
            styles: {
              borderRadius: "default",
            },
          },
        },
        {
          question: {
            text: {
              field: "",
              constantValue: {
                defaultValue: "Is there parking available?",
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
          answer: {
            text: {
              field: "",
              constantValue: {
                defaultValue: getDefaultRTF(
                  "Yes. Guests typically use nearby street parking and shared area lots around South Lamar. Parking can fill up during peak brunch and evening hours, so allowing a few extra minutes is a good idea.",
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
                url: "https://a.mktgcdn.com/p/0V-U0Tk9g5iHSg5ONJZW00L2_BGDVymefN7fqI051qE/1000x568.png",
                width: 1000,
                height: 568,
              },
              constantValueEnabled: true,
            },
            aspectRatio: 1,
            imageConstrain: "fixed",
            styles: {
              borderRadius: "default",
            },
          },
        },
      ],
    },
    render: (props) => <YextBarSocialDiningFaqSectionComponent {...props} />,
  };

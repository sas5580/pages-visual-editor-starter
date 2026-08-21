import type { ComprehensiveCTAValue, ThemeColor } from "@yext/visual-editor";

type CtaOptions = {
  color: ThemeColor;
  variant: "primary" | "secondary" | "link";
  link?: string;
};

export const createCta = (label: string, options: CtaOptions): ComprehensiveCTAValue => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValue: {
        ctaType: "textAndLink",
        label: { defaultValue: label, hasLocalizedValue: "true" },
        link: { defaultValue: options.link ?? "#", hasLocalizedValue: "true" },
        linkType: "URL",
      },
      constantValueEnabled: true,
      selectedType: "textAndLink",
    },
    openInNewTab: false,
    buttonText: { defaultValue: label, hasLocalizedValue: "true" },
    customId: "",
    customClass: "",
    dataAttributes: [],
    ariaLabel: { defaultValue: label, hasLocalizedValue: "true" },
  },
  styles: {
    variant: options.variant,
    color: options.color,
    button: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
      letterSpacing: "default",
      borderRadius: "default",
    },
    link: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
      letterSpacing: "default",
      includeCaret: "default",
    },
  },
});

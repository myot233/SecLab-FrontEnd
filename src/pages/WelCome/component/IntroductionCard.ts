export type Props = {
    title: string;
    description: string;
    svgPath: string;
    buttonText: string;
    buttonClass?: string;
    onClick?: () => void;
  }
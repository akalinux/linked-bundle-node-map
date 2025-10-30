export default interface CompassProps {
  side?: number;
  onClick?(key: string): void;
  cStyle?: { [key: string]: any };
  title?: string;
}
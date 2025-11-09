export default interface CompassProps {
  side?: number;
  onClick?(key: string): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cStyle?: { [key: string]: any };
  title?: string;
}
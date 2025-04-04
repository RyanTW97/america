declare module "react-scroll-snap" {
  import * as React from "react";

  export interface AnimatorProps {
    animation?: any;
    children: React.ReactNode;
  }

  export interface ScrollPageProps {
    page: number;
    children: React.ReactNode;
  }

  export interface ScrollContainerProps {
    children: React.ReactNode;
  }

  export const ScrollContainer: React.FC<ScrollContainerProps>;
  export const ScrollPage: React.FC<ScrollPageProps>;
  export const Animator: React.FC<AnimatorProps>;
  export function batch(...args: any[]): any;
  export function Fade(): any;
  export function MoveIn(x?: number, y?: number): any;
  export function MoveOut(x?: number, y?: number): any;
}

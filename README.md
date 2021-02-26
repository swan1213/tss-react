<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/80216211-00ef5280-863e-11ea-81de-59f3a3d4b8e4.png">  
</p>
<p align="center">
    <i>💅 Like JSS but for TypeScript. Powered by emotion 💅 </i>
    <br>
    <br>
    <img src="https://github.com/garronej/tss-react/workflows/ci/badge.svg?branch=develop">
    <img src="https://img.shields.io/bundlephobia/minzip/tss-react">
    <img src="https://img.shields.io/npm/dw/tss-react">
    <img src="https://img.shields.io/npm/l/tss-react">
</p>

```bash
$ yarn add tss-react
#OR
$ npm install --save tss-react
```


<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/109001373-28231000-76a5-11eb-8547-c2108a6411c9.gif">
</p>
<p align="center">
    <i>Try it now:</i><br>
    <a href='https://stackblitz.com/edit/tss-react?file=Hello.tsx'>
        <img src="https://user-images.githubusercontent.com/6702424/109010505-214dca80-76b0-11eb-885e-2e5ef7ade821.png">
    </a>
</p>

# Usage

`./MyComponent.tsx`
```typescript
import { createUseClassNames } from "./useClassNames";

const { useClassNames } = createUseClassNames<Props & { color: "red" | "blue" }>()({
   (theme, { color })=> ({
       "root": { 
           color,
           "&:hover": {
               "backgroundColor": "lightGrey"
           }
        }
   })
});

function MyComponent(props: Props){

    const [ color, setColor ]= useState<"red" | "blue">("red");

    const { classNames }=useClassNames({...props, color });

    return <span className={classNames.root}>hello world</span>;

}
```

`./useClassNames.ts`
```typescript
import { createUseClassNamesFactory } from "tss-react";

const theme = {
    "primaryColor": "blue";
};

function useTheme(){
    return theme;
}

export const { createUseClassNames } = createUseClassNamesFactory({ useTheme });
```

# Why this instead of JSS? 

Consider this example use of JSS:

```tsx
//JSS in bundled in @material-ui
import { makeStyles, createStyles } from "@material-ui/core/styles";

type Props = {
    color: "red" | "blue";
};

const useStyles = makeStyles(
  theme => createStyles<"root" | "label">, Props>({
    "root": {
        "backgroundColor": theme.palette.primary.main
    },
    "label": ({ color })=>({
        color
    })
  })
);

function MyComponent(props: Props){

    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <span className={classes.label}>
                Hello World
            </span>
        </div>
    );

}
```

Many pain points:
- Because TypeScript doesn't support [partial argument inference](https://github.com/microsoft/TypeScript/issues/26242),
  we have to explicitly enumerate the classes name as an union type `"root" | "label"`.
- We shouldn't have to import `createStyles` to get correct typings.
- Inconsistent naming conventions `makeStyles -> useStyles -> classes`

Let's now compare with `tss-react`

```tsx
import { createUseClassNames } from "./useClassNames";

type Props = {
    color: "red" | "blue";
};

const { useClassNames } = createUseClassNames<Props>()(
  (theme, { color })=> ({
    "root": {
        "backgroundColor": theme.palette.primary.main
    },
    "label": { color }
  })
);

function MyComponent(props: Props){

    const { classNames } = useClassNames(props);

    return (
        <div className={classNames.root}>
            <span className={classNames.label}>
                Hello World
            </span>
        </div>
    );

}
```

Benefits: 
- Less verbose, same type safety.
- Consistent naming convention `createUseClassNames -> useClassNames -> classNames`.
- You don't need to remember how things are supposed to be named, just let intellisense guide you.

Besides, `JSS`, at least the version bundled into `material-ui`, have other problems:  
- One major bug: [see issue](https://github.com/mui-org/material-ui/issues/24513#issue-790027173)
- `JSS` has poor performances compared to `emotion` [source](https://github.com/mui-org/material-ui/issues/22342#issue-684407575)


# Why not Styled component ?

See [this issue](https://github.com/mui-org/material-ui/issues/22342#issuecomment-764495033)


# API Reference

This module exports: 

- `createUseClassNamesFactory()`
- `css`: Reexport of [`import { css } from "@emotion/css"`](https://emotion.sh/docs/@emotion/css#css)
- `keyframes`:Reexport of [`import { keyframes } from "@emotion/css"`](https://emotion.sh/docs/@emotion/css#animation-keyframes)
- `cx`: Reexport of [`import { cx } from "@emotion/css"`](https://emotion.sh/docs/@emotion/css#cx)
- `injectGlobal`: Reexport of [`import { injectGlobal } from "@emotion/injectGlobal"`](https://emotion.sh/docs/@emotion/css#injectGlobal)

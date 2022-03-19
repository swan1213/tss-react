/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Cx } from "./types";
import { objectKeys } from "./tools/objectKeys";
import { getDependencyArrayRef } from "./tools/getDependencyArrayRef";
import { useCssAndCx } from "./cssAndCx";
import { useMemo } from "react";

export function mergeClasses<T extends string, U extends string>(
    classesFromUseStyles: Record<T, string>,
    classesFromProps: Partial<Record<U, string>> | undefined,
    cx: Cx,
): Record<T, string> &
    (string extends U ? {} : Partial<Record<Exclude<U, T>, string>>) {
    //NOTE: We use this test to be resilient in case classesFromProps is not of the expected type.
    if (!(classesFromProps instanceof Object)) {
        return classesFromUseStyles as any;
    }

    const out: Record<T | U, string> = {} as any;

    objectKeys(classesFromUseStyles).forEach(
        ruleName =>
            (out[ruleName] = cx(
                classesFromUseStyles[ruleName],
                classesFromProps[ruleName],
            )),
    );

    objectKeys(classesFromProps).forEach(ruleName => {
        if (ruleName in classesFromUseStyles) {
            return;
        }

        const className = classesFromProps[ruleName];

        //...Same here, that why we don't do className === undefined
        if (typeof className !== "string") {
            return;
        }

        out[ruleName] = className;
    });

    return out;
}

export function useMergedClasses<T extends string>(
    classes: Record<T, string>,
    classesOv: Partial<Record<T, string>> | undefined,
): Record<T, string> {
    const { cx } = useCssAndCx();

    return useMemo(
        () => mergeClasses(classes, classesOv, cx),
        [classes, getDependencyArrayRef(classesOv), cx],
    );
}

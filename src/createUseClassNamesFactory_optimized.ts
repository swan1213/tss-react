import "./tools/Object.fromEntries";
import { assert } from "evt/tools/typeSafety/assert";
import { typeGuard } from "evt/tools/typeSafety/typeGuard";
import { getRefFromDepsFactory } from "./tools/getRefFromDeps";
import { areSameSet } from "./tools/areSameSet";
import { Polyfill as WeakMap } from "minimal-polyfills/WeakMap";
import { css } from "@emotion/css";
import type { CSSObject } from "@emotion/css";
import { objectKeys } from "./tools/objectKeys";

/** 
 * !EXPERIMENTAL!
 * 
 * Functionally equivalent from the exported but with optimization
 * mechanism implemented.
 * 
 * Implementation of JSS createStyles() based on @emotion/react
 * 
 * const { useCssRecord } = createUseClassNames<Props & { color: "red" | "blue" }>()({
 *    (theme, { color })=> ({
 *        "root": { color }
 *    })
 * });
 * 
 * 
 * function MyComponent(props: Props){
 * 
 *     const [ color, setColor ]= useState<"red" | "blue">("red");
 * 
 *     const { classNames }=useClassName({...props, color });
 * 
 *     return <span className={classNames.root}>hello world</span>;
 * 
 * }
 * 
 */
export function createUseClassNamesFactory<Theme extends Object = {}>(
    params: {
        useTheme(): Theme;
    }
) {

    const { useTheme } = params;

    function createUseClassNames<Params extends Record<string, unknown>>() {

        return function <Key extends string>(
            getCssObjects: (theme: Theme, params: Params) => Record<Key, CSSObject>
        ) {

            const getClassNamesAndAccessedParamsKeys = (theme: Theme, params: Params) => {

                const accessedParamsKeys = new Set<Key>();

                const cssObjects = getCssObjects(
                    theme,
                    new Proxy(
                        params,
                        {
                            "get": (...args) => {

                                const [, prop] = args;

                                assert(
                                    typeof prop === "string" &&
                                    typeGuard<Key>(prop)
                                );

                                accessedParamsKeys.add(prop);

                                return Reflect.get(...args);

                            }
                        }
                    )
                );

                return {
                    "classNames": Object.fromEntries(
                        objectKeys(cssObjects)
                            .map(key => [key, css(cssObjects[key])])
                    ) as Record<Key, string>,
                    accessedParamsKeys
                };

            };

            const arrayOfAccessedParamsKeys: Set<Key>[] = [];

            const classNamesByRef = new WeakMap<Object, Record<Key, string>>();

            const { getRef } = (() => {

                const getDeps = (accessedParamsKeys: Set<Key>, params: Params) =>
                    [...accessedParamsKeys].map(key => params[key])

                const { getRefFromDeps } = getRefFromDepsFactory({ "max": 50 });

                function getRef(theme: Theme, accessedParamsKeys: Set<Key>, params: Params) {
                    return getRefFromDeps([theme, ...getDeps(accessedParamsKeys, params)])
                }

                return { getRef };


            })();


            function useClassNames(params: Params) {

                const theme = useTheme();

                for (const accessedParamsKeys of arrayOfAccessedParamsKeys) {

                    const classNames = classNamesByRef.get(
                        getRef(theme, accessedParamsKeys, params)
                    );

                    if (classNames !== undefined) {
                        return { classNames };
                    }

                }

                const { classNames, accessedParamsKeys } = getClassNamesAndAccessedParamsKeys(theme, params);

                if (
                    arrayOfAccessedParamsKeys.every(
                        accessedParamsKeys_i => !areSameSet(
                            accessedParamsKeys_i,
                            accessedParamsKeys
                        )
                    )
                ) {
                    arrayOfAccessedParamsKeys.push(accessedParamsKeys);
                }

                classNamesByRef.set(
                    getRef(theme, accessedParamsKeys, params),
                    classNames
                );


                return { classNames };

            }

            return { useClassNames };

        }

    }

    return { createUseClassNames };

}




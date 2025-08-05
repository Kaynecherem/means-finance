import { lazy, LazyExoticComponent, ComponentType } from 'react'

const lazyWithRetry = <T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>,
    retries = 3,
    delay = 1000
): LazyExoticComponent<T> => {
    return lazy(() => {
        const attempt = (): Promise<{ default: T }> =>
            factory().catch((error) => {
                if (retries <= 0) {
                    throw error
                }
                retries -= 1
                return new Promise<{ default: T }>((resolve) => {
                    setTimeout(() => resolve(attempt()), delay)
                })
            })
        return attempt()
    })
}

export default lazyWithRetry

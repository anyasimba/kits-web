import React_ from 'react'
import * as _ from './react'
Object.assign(global, { React: React_ }, _)

declare global {
    const React: typeof React_
    const useEffect: typeof _.useEffect
    const useCallback: typeof _.useCallback
    const useRef: typeof _.useRef
    const useState: typeof _.useState
    const useMemo: typeof _.useMemo
    const memo: typeof _.memo
}

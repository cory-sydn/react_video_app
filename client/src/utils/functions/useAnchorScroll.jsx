import { useEffect, useRef, useState, useCallback} from "react"

export function useAnchorScroll() {
  const [y, setY] = useState(null)
  const elRef = useRef()
  
  const dropAnchor = useCallback(() => {
    window.scrollTo({
      top: y,
      left: 0,
    });
  }, [y])
  
  useEffect(() => {
    const el = elRef.current
    if (el) {
      y && dropAnchor()
      window.addEventListener("scroll", dropAnchor)
      return () => {
        window.removeEventListener("scroll", dropAnchor)
      }
    }
  }, [dropAnchor, y])

  useEffect(() => {
    elRef.current && y === null && setY(window.pageYOffset)
  },[elRef, setY, y] )
  
  return elRef
}
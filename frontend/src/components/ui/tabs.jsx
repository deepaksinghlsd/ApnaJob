import * as React from "react"

import { cn } from "@/lib/utils"

const TabsContext = React.createContext(null)

const Tabs = ({ defaultValue, value: controlledValue, onValueChange, className, children, ...props }) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const setValue = React.useCallback(
    (nextValue) => {
      if (!isControlled) setUncontrolledValue(nextValue)
      onValueChange?.(nextValue)
    },
    [isControlled, onValueChange]
  )

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} role="tablist" className={cn("inline-flex items-center justify-center", className)} {...props} />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, onClick, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  const active = context?.value === value

  return (
    <button
      ref={ref}
      role="tab"
      type="button"
      aria-selected={active}
      data-state={active ? "active" : "inactive"}
      onClick={(event) => {
        context?.setValue(value)
        onClick?.(event)
      }}
      className={cn(className)}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  if (context?.value !== value) return null

  return (
    <div ref={ref} role="tabpanel" className={cn(className)} {...props}>
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }

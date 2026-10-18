import React from 'react'
import { createRoot } from 'react-dom/client'
import Form from '@rjsf/core'
import schema from './schema.json'
export function mount (validator) {
  createRoot(document.getElementById('root')).render(<Form schema={schema} validator={validator} />)
}

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'

type RichTextEditorProps = {
  value?: string
  placeholder?: string
  onChange?: (val: string) => void
}

export type RichTextEditorRef = {
  getEditorState: () => EditorState
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value = '', placeholder, onChange }, ref) => {
    const [editorState, setEditorState] = useState(() =>
      value
        ? EditorState.createWithContent(stateFromHTML(value))
        : EditorState.createEmpty()
    )

    useImperativeHandle(ref, () => ({
      getEditorState: () => editorState,
    }))

    useEffect(() => {
      let isMounted = true
      if (value && isMounted) {
        setEditorState(EditorState.createWithContent(stateFromHTML(value)))
      }
      return () => {
        isMounted = false
      }
    }, [])
    
    const handleEditorStateChange = (state: EditorState) => {
      if (onChange) {
        setEditorState(state)
        const contentState = state.getCurrentContent()
        const htmlString = stateToHTML(contentState).replace(/\n/g, '')
        onChange(htmlString)
      }
    }

    return (
      <div className="rich-text-editor">
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          placeholder={placeholder}
          onEditorStateChange={handleEditorStateChange}
          editorStyle={{ border: '1px solid #f1f1f1', minHeight: '200px' }}
        />
      </div>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'

export default RichTextEditor

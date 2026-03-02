import { EditorState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

type RichTextEditorProps = {
  value?: string
  placeholder?: string
  onChange?: (val: string) => void
}

export type RichTextEditorRef = {
  getEditorState: () => EditorState
}

const normalizeHtml = (html: string) =>
  (html || '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value = '', placeholder, onChange }, ref) => {
    const initialEditorState = useMemo(
      () =>
        value
          ? EditorState.createWithContent(stateFromHTML(value))
          : EditorState.createEmpty(),
      []
    )
    const [editorState, setEditorState] =
      useState<EditorState>(initialEditorState)

    useImperativeHandle(ref, () => ({
      getEditorState: () => editorState,
    }))

    useEffect(() => {
      const currentHtml = normalizeHtml(
        stateToHTML(editorState.getCurrentContent())
      )
      const incomingHtml = normalizeHtml(value)

      if (incomingHtml === currentHtml) return

      if (!incomingHtml) {
        setEditorState(EditorState.createEmpty())
      } else {
        setEditorState(
          EditorState.createWithContent(stateFromHTML(incomingHtml))
        )
      }
    }, [value])

    const handleEditorStateChange = (state: EditorState) => {
      setEditorState(state)
      if (onChange) {
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
          editorStyle={{
            border: '1px solid #f1f1f1',
            minHeight: '200px',
            padding: '1rem',
          }}
          onEditorStateChange={handleEditorStateChange}
        />
      </div>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'
export default RichTextEditor

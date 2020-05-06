import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import {
  EditorState, convertFromHTML, ContentState, convertToRaw
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import Typography from '@material-ui/core/Typography';
import 'dan-styles/vendors/react-draft-wysiwyg/react-draft-wysiwyg.css';
import styles from './richEditor-jss';


function RichEditor(props) {
  const { id, label, text, classes } = props;
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [deliveredText, setDeliveredText] = useState(false);

  useEffect(() => {
    if (text && !deliveredText) {
      let contentBlock;
      if (text) {
        const blocksFromHTML = convertFromHTML(text);
        if (blocksFromHTML.contentBlocks) {
          contentBlock = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap);
        }
      }
      setEditorState(contentBlock ? EditorState.createWithContent(contentBlock) : EditorState.createEmpty());
      setDeliveredText(true);
    }
  }, [text]);

  const onEditorStateChange = _editorState => {
    const { onTextEditorChange } = props;
    setEditorState(_editorState);
    onTextEditorChange({ target: { name: id, value: draftToHtml(convertToRaw(editorState.getCurrentContent())) } });
  };

  return (
    <Paper style={{ margin: '10px 0px 0px 0px' }}>
      <Typography variant="subtitle2" style={{ padding: '15px' }}>{label}</Typography>
      <Editor
        editorState={editorState}
        editorClassName={classes.textEditor}
        toolbarClassName={classes.toolbarEditor}
        onEditorStateChange={onEditorStateChange}
      />
    </Paper>
  );
}

RichEditor.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  onTextEditorChange: PropTypes.func

};

RichEditor.defaultProps = {
  id: 'description',
  label: 'Description',
  onTextEditorChange: () => { }
};

export default withStyles(styles)(RichEditor);

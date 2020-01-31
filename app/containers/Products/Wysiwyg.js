import React, { PureComponent, Fragment } from 'react';
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
import styles from './email-jss';

class Wysiwyg extends PureComponent {
  constructor(props) {
    super(props);
    const { text } = this.props;
    let contentBlock;
    if (text) {
      const blocksFromHTML = convertFromHTML(text);
      contentBlock = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap);
    }
    this.state = {
      editorState: contentBlock ? EditorState.createWithContent(contentBlock) : null,
    };
  }

  onEditorStateChange = editorState => {
    const { onTextEditorChange, label } = this.props;
    this.setState({
      editorState,
    });
    onTextEditorChange({ target: { name: label, value: draftToHtml(convertToRaw(editorState.getCurrentContent())) } });
  };

  render() {
    const { editorState } = this.state;
    const { label, text, classes } = this.props;
    return (
      <Fragment>
        {text && (
          <Paper style={{ margin: '10px 0px 0px 0px' }}>
            <Typography variant="subtitle2" style={{ padding: '15px' }}>{label}</Typography>
            <Editor
              editorState={editorState}
              editorClassName={classes.textEditor}
              toolbarClassName={classes.toolbarEditor}
              onEditorStateChange={this.onEditorStateChange}
            />
          </Paper>
        )}
        {/* <div>{draftToHtml(convertToRaw(editorState.getCurrentContent()))}</div> */}
      </Fragment>
    );
  }
}


Wysiwyg.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  label: PropTypes.string,
  onTextEditorChange: PropTypes.func

};

Wysiwyg.defaultProps = {
  label: 'Description',
  onTextEditorChange: () => {}
};

export default withStyles(styles)(Wysiwyg);

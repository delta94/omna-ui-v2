import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import Typography from '@material-ui/core/Typography';
import 'dan-styles/vendors/react-draft-wysiwyg/react-draft-wysiwyg.css';
import styles from './email-jss';

class Wysiwyg extends PureComponent {
  constructor(props) {
    super(props);
    const { text } = this.props;
    const blocksFromHTML = convertFromHTML(text);
    const contentBlock = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap);
    if (contentBlock) {
      const editorState = EditorState.createWithContent(contentBlock);
      this.state = {
        editorState,
      };
    }
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    const { classes } = this.props;
    return (
      <Paper style={{ margin: '10px 0px 0px 0px' }}>
        <Typography variant="subtitle2" style={{ padding: '15px' }}>Description</Typography>
        <Editor
          editorState={editorState}
          editorClassName={classes.textEditor}
          toolbarClassName={classes.toolbarEditor}
          onEditorStateChange={this.onEditorStateChange}
        />
      </Paper>
    );
  }
}

Wysiwyg.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired
};

export default withStyles(styles)(Wysiwyg);

import React, { PureComponent, Fragment } from 'react';
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
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    const { text, classes } = this.props;
    return (
      <Fragment>
        {text && (
          <Paper style={{ margin: '10px 0px 0px 0px' }}>
            <Typography variant="subtitle2" style={{ padding: '15px' }}>Description</Typography>
            <Editor
              editorState={editorState}
              editorClassName={classes.textEditor}
              toolbarClassName={classes.toolbarEditor}
              onEditorStateChange={this.onEditorStateChange}
            />
          </Paper>
        )}
      </Fragment>
    );
  }
}


Wysiwyg.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired
};

export default withStyles(styles)(Wysiwyg);

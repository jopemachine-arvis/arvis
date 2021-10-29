import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import { OuterContainer } from './components';
import * as styles from './style';
import { snippetInfoChangeHandler } from '../utils';

type IProps = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  snippetInfo: SnippetItem;
  reloadSnippets: () => void;
};

const SnippetInfoModal = (props: IProps) => {
  const { opened, setOpened, snippetInfo, reloadSnippets } = props;

  const toggle = () => setOpened(!opened);

  const [snippet, setSnippet] = useState<string>('');

  useEffect(() => {
    if (snippetInfo.snippet) {
      setSnippet(snippetInfo.snippet);
    } else {
      setSnippet('');
    }
  }, [snippetInfo]);

  const editSnippetInfo = () => {
    snippetInfoChangeHandler(snippetInfo, 'snippet', snippet).then(() => {
      reloadSnippets();
      return null;
    });
  };

  const saveBtnHandler = () => {
    editSnippetInfo();
    toggle();
  };

  return (
    <OuterContainer>
      <Modal
        fade
        centered
        isOpen={opened}
        toggle={toggle}
        style={{
          color: '#212529',
          minHeight: 500,
        }}
      >
        <ModalHeader toggle={toggle}>Edit snippet information</ModalHeader>
        <ModalBody>
          <FormGroup check>
            <Label check style={styles.labelStyle}>
              Snippet
            </Label>
            <Input
              name="text"
              type="textarea"
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            style={styles.btnStyle}
            color="primary"
            onClick={saveBtnHandler}
          >
            Save
          </Button>
          <Button style={styles.btnStyle} color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </OuterContainer>
  );
};

export default SnippetInfoModal;

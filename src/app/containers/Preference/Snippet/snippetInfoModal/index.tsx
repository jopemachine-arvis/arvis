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
import { snippetInfosChangeHandler, snippetNameChangeHandler } from '../utils';

type IProps = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  snippetInfo: SnippetItem;
  reloadSnippets: () => void;
};

const SnippetInfoModal = (props: IProps) => {
  const { opened, setOpened, snippetInfo, reloadSnippets } = props;

  const toggle = () => setOpened(!opened);

  const [name, setName] = useState<string>('');
  const [snippet, setSnippet] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    if (snippetInfo) {
      setName(snippetInfo.name ?? '');
      setSnippet(snippetInfo.snippet ?? '');
      setKeyword(snippetInfo.keyword ?? '');
    } else {
      setName('');
      setSnippet('');
      setKeyword('');
    }
  }, [snippetInfo]);

  const editSnippetInfo = () => {
    snippetInfosChangeHandler(
      snippetInfo,
      ['name', 'snippet', 'keyword'],
      [name, snippet, keyword]
    ).then(() => {
      snippetNameChangeHandler(snippetInfo, name).then(reloadSnippets);
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
              Name
            </Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup check>
            <Label check style={styles.labelStyle}>
              Keyword
            </Label>
            <Input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </FormGroup>
          <FormGroup check>
            <Label check style={styles.labelStyle}>
              Snippet
            </Label>
            <Input
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

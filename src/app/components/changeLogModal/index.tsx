import React, { useEffect, useState } from 'react';
import got from 'got';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MarkdownRenderer from '../markdownRenderer';

type IProps = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
};

const arvisChangeLogAPI =
  'https://raw.githubusercontent.com/jopemachine/arvis/master/CHANGE_LOG.md';

const ChangeLogModal = (props: IProps) => {
  const { opened, setOpened } = props;
  const [content, setContent] = useState<string>();

  const toggle = () => setOpened(!opened);

  useEffect(() => {
    got.get(arvisChangeLogAPI).then((response) => setContent(response.body));
  }, []);

  return (
    <Modal
      fade
      centered
      isOpen={opened}
      toggle={toggle}
      con="changeLogModal"
      style={{
        color: '#212529',
      }}
    >
      <ModalHeader toggle={toggle}>Change Log</ModalHeader>
      <ModalBody style={{ height: 600 }}>
        {content && (
          <MarkdownRenderer
            width="93%"
            height="90%"
            data={content}
            padding={10}
          />
        )}
        {!content && 'Loading..'}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => setOpened(false)}>
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ChangeLogModal;

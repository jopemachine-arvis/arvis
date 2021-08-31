/* eslint-disable react/no-array-index-key */

import React, { useState } from 'react';
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
import fse from 'fs-extra';
import plist from 'plist';
import path from 'path';
import { arvisSnippetCollectionPath } from '@config/path';
import { OuterContainer } from './components';

type IProps = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  collection: string;
  collectionInfo: SnippetCollectionInfo;
};

const CollectionEditModal = (props: IProps) => {
  const { opened, setOpened, collection, collectionInfo } = props;

  const toggle = () => setOpened(!opened);

  const [name, setName] = useState<string>(collection);

  const [prefix, setPrefix] = useState<string>(
    collectionInfo.snippetKeywordPrefix
  );

  const [suffix, setSuffix] = useState<string>(
    collectionInfo.snippetKeywordSuffix
  );

  const rebuildPlist = (plistPath: string) => {
    const plistStr = plist.build(
      {
        snippetkeywordprefix: prefix,
        snippetkeywordsuffix: suffix,
      },
      { allowEmpty: true, pretty: true, dontPrettyTextNodes: false }
    );

    console.log('plistStr', plistStr);

    return fse.writeFile(plistPath, plistStr, { encoding: 'utf8' });
  };

  const saveBtnHandler = () => {
    const oldCollectionDirName = path.resolve(
      arvisSnippetCollectionPath,
      collection
    );
    const infoPlistPath = path.resolve(oldCollectionDirName, 'info.plist');

    rebuildPlist(infoPlistPath)
      .then(() => {
        const newCollectionDirName = path.resolve(
          arvisSnippetCollectionPath,
          name
        );
        if (oldCollectionDirName !== newCollectionDirName) {
          fse
            .rename(oldCollectionDirName, newCollectionDirName)
            .catch(console.error);
        }
        return null;
      })
      .catch(console.error);

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
        }}
      >
        <ModalHeader toggle={toggle}>{}</ModalHeader>
        <ModalBody>
          <FormGroup check>
            <Label check>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
              />{' '}
              Name
            </Label>
            <Label check>
              <Input
                value={prefix}
                onChange={(e) => {
                  setPrefix(e.target.value);
                }}
                type="text"
              />{' '}
              Prefix
            </Label>
            <Label check>
              <Input
                value={suffix}
                onChange={(e) => {
                  setSuffix(e.target.value);
                }}
                type="text"
              />{' '}
              Suffix
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={saveBtnHandler}>
            Save
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </OuterContainer>
  );
};

export default CollectionEditModal;

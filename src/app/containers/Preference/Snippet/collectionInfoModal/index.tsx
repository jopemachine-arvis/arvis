/* eslint-disable react/no-array-index-key */

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
import fse from 'fs-extra';
import path from 'path';
import { arvisSnippetCollectionPath } from '@config/path';
import { OuterContainer } from './components';
import * as styles from './style';
import { filenamifyPath, rebuildPlist, createEmptySnippet } from '../utils';

type IProps = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  collection?: string;
  collectionInfo?: SnippetCollectionInfo;
  reloadSnippets: () => void;
};

// If collection is undefined, make new collection.
// Else, edit the collection's information
const CollectionInfoModal = (props: IProps) => {
  const { opened, setOpened, collection, collectionInfo, reloadSnippets } =
    props;

  const toggle = () => setOpened(!opened);

  const [name, setName] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');

  useEffect(() => {
    if (collection) {
      setName(collection);
    } else {
      setName('');
    }
  }, [collection]);

  useEffect(() => {
    if (collectionInfo) {
      setPrefix(collectionInfo.snippetKeywordPrefix ?? '');
      setSuffix(collectionInfo.snippetKeywordSuffix ?? '');
    } else {
      setPrefix('');
      setSuffix('');
    }
  }, [collectionInfo]);

  const makeNewCollection = () => {
    const collectionDirName = filenamifyPath(
      path.resolve(arvisSnippetCollectionPath, name)
    );

    return fse
      .mkdir(collectionDirName)
      .then(() => {
        return createEmptySnippet(collectionDirName)
          .then(reloadSnippets)
          .catch(console.error);
      })
      .catch(console.error);
  };

  const editCollectionInfo = () => {
    const oldCollectionDirName = path.resolve(
      arvisSnippetCollectionPath,
      collection!
    );

    const infoPlistPath = path.resolve(oldCollectionDirName, 'info.plist');

    rebuildPlist(infoPlistPath, {
      snippetkeywordprefix: prefix,
      snippetkeywordsuffix: suffix,
    })
      .then(() => {
        const newCollectionDirName = filenamifyPath(
          path.resolve(arvisSnippetCollectionPath, name)
        );

        if (oldCollectionDirName !== newCollectionDirName) {
          fse
            .rename(oldCollectionDirName, newCollectionDirName)
            .then(reloadSnippets)
            .catch(console.error);
        } else {
          reloadSnippets();
        }

        return null;
      })
      .catch(console.error);
  };

  const validate = () => {
    return name.length > 0;
  };

  const saveBtnHandler = () => {
    if (!validate()) return;

    if (collection) {
      editCollectionInfo();
    } else {
      makeNewCollection();
    }

    toggle();
  };

  const headerText = collection
    ? 'Edit snippet collection information'
    : 'Add new snippet collection';

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
        <ModalHeader toggle={toggle}>{headerText}</ModalHeader>
        <ModalBody>
          <FormGroup check>
            <Label check style={styles.labelStyle}>
              Name
              <Input
                placeholder="The name of the collection"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
              />
            </Label>
            <Label check style={styles.labelStyle}>
              Prefix
              <Input
                placeholder="Set prefix after all keywords"
                value={prefix}
                onChange={(e) => {
                  setPrefix(e.target.value);
                }}
                type="text"
              />
            </Label>
            <Label check style={styles.labelStyle}>
              Suffix
              <Input
                placeholder="Set suffix before all keywords"
                value={suffix}
                onChange={(e) => {
                  setSuffix(e.target.value);
                }}
                type="text"
              />
            </Label>
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

CollectionInfoModal.defaultProps = {
  collection: undefined,
  collectionInfo: undefined,
};

export default CollectionInfoModal;

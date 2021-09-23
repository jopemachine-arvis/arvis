import React, { Fragment, useContext, useState } from 'react';
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
import useForceUpdate from 'use-force-update';
import alphaSort from 'alpha-sort';
import { installExtension } from '@helper/extensionDownloadHandler';
import { SpinnerContext } from '@helper/spinnerContext';
import { OuterContainer } from './components';

type IProps = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
};

// Should be hosted on npm
const recommendList = [
  'jopemachine.arvis-app-launcher-plugin',
  'jopemachine.arvis-calculator-plugin',
  'jopemachine.arvis-chrome-workflow',
  'jopemachine.arvis-convert-unit-plugin',
  'jopemachine.arvis-filesearch-plugin',
  'jopemachine.arvis-open-setting-plugin',
  'jopemachine.arvis-simple-websearch-plugin',
].sort(alphaSort({ natural: true }));

const headerTexts = ['Welcome!', 'Select extensions to install', 'Works Done'];

const buttonTexts = ['Next', 'Install', 'Quit'];

const WalkThroughModal = (props: IProps) => {
  const { opened, setOpened } = props;

  const toggle = () => setOpened(!opened);

  const [page, setPage] = useState<number>(0);

  const forceUpdate = useForceUpdate();

  const [isSpinning, setSpinning] = useContext(SpinnerContext) as any;

  const [extensionCheckedList, setExtensionCheckedList] = useState<boolean[]>(
    recommendList.map(() => true)
  );

  const onChangeExtensionCheckbox = (extensionIdx: number) => {
    const temp = extensionCheckedList;
    temp[extensionIdx] = !temp[extensionIdx];
    setExtensionCheckedList(temp);
    forceUpdate();
  };

  const renderTexts = (strs: string[]) => {
    return (
      <div>
        {strs.map((str: string, idx: number) => {
          if (idx === strs.length - 1)
            return <Fragment key={`fragment-${idx}`}>{str}</Fragment>;
          return (
            <Fragment key={`fragment-${idx}`}>
              {str}
              <br />
            </Fragment>
          );
        })}
      </div>
    );
  };

  const renderWelcomePage = () => {
    return renderTexts([
      `🎉 Welcome to the Arvis!`,
      '',
      `I'd like to recommend you to read the basic usage of Arvis`,
      `Now I'll set you up with some basic core extensions.`,
      '',
      `If you're not sure about which extension you need to, I'd recommend to
        try installing all these extensions.`,
      '',
      `You can deactive or delete this extensions if you don't need these extensions.`,
    ]);
  };

  const renderCheckCoreExtensionPage = () => {
    return recommendList.map((extensionBundleId, index) => (
      <FormGroup check key={`checkbox-${index}`}>
        <Label check>
          <Input
            onChange={() => onChangeExtensionCheckbox(index)}
            checked={extensionCheckedList[index]}
            type="checkbox"
          />{' '}
          {extensionBundleId.split('.')[1]}
        </Label>
      </FormGroup>
    ));
  };

  const renderWorksDonePage = () => {
    return renderTexts([
      `Done with installing some core extensions.`,
      `I'd appreciate it if you could leave me any kinds of feedback about arvis.`,
      `Any kind of feedback is very helpful to developing arvis :)`,
    ]);
  };

  const renderPage = (currentPage: number) => {
    switch (currentPage) {
      case 0:
        return renderWelcomePage();

      case 1:
        return renderCheckCoreExtensionPage();

      case 2:
        return renderWorksDonePage();

      default:
        throw new Error(`invalid page in walkThrough modal: '${currentPage}'`);
    }
  };

  const installBasicExtensionsHandler = async () => {
    setSpinning(true);

    return Promise.allSettled(
      recommendList
        .filter((_extension: string, idx: number) => extensionCheckedList[idx])
        .map((extension: string) => {
          return installExtension({
            installType: 'npm',
            bundleId: extension,
            extensionType: extension.endsWith('plugin') ? 'plugin' : 'workflow',
          }).catch(console.error);
        })
    )
      .then((result) => {
        setSpinning(false);
        return result;
      })
      .catch(console.error);
  };

  const nextBtnHandler = () => {
    if (page >= headerTexts.length) {
      setOpened(false);
      return;
    }

    switch (buttonTexts[page]) {
      case 'Next':
        setPage(page + 1);
        break;

      case 'Install':
        installBasicExtensionsHandler()
          .then(() => {
            setPage(page + 1);
            setOpened(true);
            return null;
          })
          .catch(console.error);

        setOpened(false);
        break;

      case 'Quit':
        setOpened(false);
        break;

      default:
        throw new Error(`Button type invalid: '${buttonTexts[page]}'`);
    }
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
        <ModalHeader toggle={toggle}>{headerTexts[page]}</ModalHeader>
        <ModalBody>{renderPage(page)}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={nextBtnHandler}>
            {buttonTexts[page]}
          </Button>
        </ModalFooter>
      </Modal>
    </OuterContainer>
  );
};

export default WalkThroughModal;

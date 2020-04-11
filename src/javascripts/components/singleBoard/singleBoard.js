import pinsData from '../../helpers/data/pinsData';
import pinsCardBuilder from '../pinsCardBuilder/pinsCardBuilder';
import utils from '../../helpers/utils';

const boardsDiv = $('#boards-container');
const pinsDiv = $('#single-board-container');

const exitPinsViewEvent = () => {
  boardsDiv.removeClass('hide');
  pinsDiv.addClass('hide');
};

const showPinDeleteBtn = (e) => {
  const pinContent = e.target;
  $(pinContent).find('.delete-pin-btn').removeClass('hide');
  $(pinContent).find('.pins-photo').addClass('darken-img');
};

const hidePinDeleteBtn = (e) => {
  const pinContent = e.target;
  $(pinContent).find('.delete-pin-btn').addClass('hide');
  $(pinContent).find('.pins-photo').removeClass('darken-img');
};

// click event that deletes selected pin and recalls the GET request to print pins
const removePin = (e) => {
  const pinId = e.target.closest('.card').id;
  const selectedBoardId = $('.pins-container').data('boardId');
  pinsData.deletePin(pinId)
    .then(() => {
      // eslint-disable-next-line no-use-before-define
      displaySingleBoard(selectedBoardId);
    })
    .catch((err) => console.error('could not delete pin', err));
};

// click event that adds a new pin
const createNewPin = () => {
  const selectedBoardId = $('.pins-container').data('boardId');
  const newPinObject = {
    boardId: selectedBoardId,
    imageUrl: $('#pin-image-url').val(),
  };
  pinsData.addPin(newPinObject)
    .then(() => {
      // eslint-disable-next-line no-use-before-define
      displaySingleBoard(selectedBoardId);
      $('#new-pin-form').trigger('reset');
    })
    .catch((err) => console.error('could not add a new board', err));
};

const pinsEvents = () => {
  $('body').on('click', '#create-pin-btn', createNewPin);
  $('body').on('click', '.delete-pin-btn', removePin);
  $('body').on('click', '#exit-pins-view', exitPinsViewEvent);
};

// GET request that accesses pins entity and calls printToDOM
const displaySingleBoard = (selectedBoardId) => {
  pinsData.getPinsByBoardId(selectedBoardId)
    .then((pins) => {
      let domString = '';
      domString += '<h1 class="text-center my-3">Pins</h1>';
      domString += '<button id="exit-pins-view" class="btn mr-3"><i class="fas fa-undo fa-2x"></i></button>';
      domString += `<div class="d-flex flex-wrap justify-content-center pins-container" id="test" data-board-id=${selectedBoardId}>`;
      domString += '<div class="col-12 text-center">';
      domString += '<button type="button" id="show-pins-form" class="btn btn-light" data-toggle="modal" data-target="#pins-form-modal">';
      domString += '<i class="fas fa-plus"></i></button>';
      domString += '</button>';
      domString += '</div>';
      pins.forEach((pin) => {
        domString += pinsCardBuilder.buildPinCards(pin);
      });
      domString += '</div">';
      utils.printToDom('single-board-container', domString);
      pinsDiv.removeClass('hide');
      boardsDiv.addClass('hide');
    })
    .catch((err) => console.error('get pins by boardId broke', err));
};

// click event when selecting the board to view
const viewBoardEvent = (e) => {
  const selectedBoardId = e.target.closest('.card').id;
  displaySingleBoard(selectedBoardId);
};

export default {
  viewBoardEvent,
  showPinDeleteBtn,
  hidePinDeleteBtn,
  pinsEvents,
};

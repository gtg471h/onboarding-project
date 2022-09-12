import React, {useState, FC, ChangeEvent, ComponentProps} from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import {TodoItem} from "../models/TodoItem";

interface CustomModalProps {
  inputItem: TodoItem;
  toggle: ComponentProps<typeof ModalHeader>['toggle'] & ComponentProps<typeof Modal>['toggle'];
  onSave: (item: TodoItem) => void;
}

export const CustomModal: FC<CustomModalProps> = ({inputItem, toggle, onSave}) => {
  const [activeItem, setNewInputItem] = useState<TodoItem>(inputItem)

  const {id, title, description, completed} = activeItem;

  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    setNewInputItem({ id, title, description, completed, [name]: value });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, checked } = e.target;

    setNewInputItem({ id, title, description, completed, [name]: checked });
  };

  return (
    <Modal isOpen={true} toggle={toggle}>
      <ModalHeader toggle={toggle}>Todo Item</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="todo-title">Title</Label>
            <Input
              type="text"
              id="todo-title"
              name="title"
              value={title}
              onChange={handleTextInputChange}
              placeholder="Enter Todo Title"
            />
          </FormGroup>
          <FormGroup>
            <Label for="todo-description">Description</Label>
            <Input
              type="text"
              id="todo-description"
              name="description"
              value={description}
              onChange={handleTextInputChange}
              placeholder="Enter Todo Description"
            />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="completed"
                checked={completed}
                onChange={handleCheckboxChange}
              />
              Completed
            </Label>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={() => onSave(activeItem)}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

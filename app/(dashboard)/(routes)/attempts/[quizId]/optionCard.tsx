import { CheckIcon } from "lucide-react";

interface OptionCardProps {
  question: {
    id: string;
    title: string;
    options: {
      id: string;
      text: string;
    }[];
  };
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
}

const OptionCard = ({
  question,
  selectedOptionId,
  onSelectOption,
}: OptionCardProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{question.title}</h2>

      {question.options.map((option, index) => {
        const isSelected = selectedOptionId === option.id;
        console.log(isSelected);
        return (
          <div
            key={option.id}
            onClick={() => onSelectOption(option.id)}
            className={`flex justify-between items-center border rounded-md p-3 cursor-pointer
              ${
                isSelected
                  ? "border-green-600 bg-green-50"
                  : "hover:bg-gray-100"
              }
            `}
          >
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center">
                {String.fromCharCode(65 + index)}
              </div>
              <p>{option.text}</p>
            </div>

            {isSelected && (
              <div className="w-5 h-5 bg-green-600 rounded-full text-white flex items-center justify-center">
                <CheckIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OptionCard;

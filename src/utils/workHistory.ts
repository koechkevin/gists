import { Company, Position, State, StateCompany, StatePosition } from '../pages/Application/WorkHistory/interfaces';
import { WorkHistoryFields } from './constants';
import { getIntegerMonth, getMonthName } from './utils';

export const blankPosition: Position = {
  title: '',
  experience: '',
  startMonth: '',
  endMonth: '',
  startYear: '',
  endYear: '',
  addressCountry: '',
  stillWorking: false,
};

/**
 * @description Gets updated company within the state
 * @param {State} state
 * @param {number} index
 * @returns {StateCompany}
 */
export const getUpdatedCompany = (state: State, index: number): StateCompany =>
  state.companies.filter((company: StateCompany) => company.index === index)[0];

/**
 * @description Gets an updated position within the state
 * @param {State} state
 * @param {number} index
 * @param {number} positionIndex
 * @returns {void}
 */
export const getUpdatedPosition = (state: State, index: number, positionIndex: number): StatePosition => {
  const updatedCompany: StateCompany = getUpdatedCompany(state, index);
  const updatedPosition: StatePosition = updatedCompany.positions.filter(
    (position: StatePosition) => position.index === positionIndex,
  )[0];

  return updatedPosition;
};

/**
 * @description Gets companies in the state that have not been updated
 * @param {State} state
 * @param {number} index
 * @returns {StateCompany[]}
 */
export const getUnchangedCompanies = (state: State, index: number): StateCompany[] =>
  state.companies.filter((company: StateCompany) => company.index !== index);

/**
 * @description Gets the unchanged positions for a specific company
 * @param {State} state
 * @param {number} index
 * @param {number} positionIndex
 */
export const getUnchangedPositions = (state: State, index: number, positionIndex: number): StatePosition[] => {
  const updatedCompany: StateCompany = getUpdatedCompany(state, index);
  const unchangedPositions: StatePosition[] = updatedCompany.positions.filter(
    (position: StatePosition) => position.index !== positionIndex,
  );

  return unchangedPositions;
};

/**
 * @description updates the properties of a given position
 * @param {number} index
 * @param {State} state
 * @param {Function} setState
 * @param {string} field
 * @param {number} positionIndex
 * @param {boolean} save
 * @param {any} value
 * @returns {void}
 */
export const updatePosition = (
  index: number,
  state: State,
  setState,
  field: string,
  positionIndex: number,
  value: string | boolean,
  save?: boolean,
): void => {
  const updatedCompany: StateCompany = getUpdatedCompany(state, index);
  const updatedPosition: StatePosition = getUpdatedPosition(state, index, positionIndex);
  const unchangedCompanies: StateCompany[] = getUnchangedCompanies(state, index);
  const unchangedPositions: StatePosition[] = getUnchangedPositions(state, index, positionIndex);
  const stillWorking: boolean = field === WorkHistoryFields.STILL_WORKING;
  const endedJob: boolean = field === WorkHistoryFields.END_MONTH || field === WorkHistoryFields.END_YEAR;

  setState({
    ...state,
    save: save ? save : false,
    checkStillWorking: stillWorking ? true : state.checkStillWorking,
    companies: [
      ...unchangedCompanies,
      {
        ...updatedCompany,
        positions: [
          ...unchangedPositions,
          {
            ...updatedPosition,
            [field]: value,
            endMonth:
              stillWorking && value === true
                ? ''
                : endedJob && field === WorkHistoryFields.END_MONTH
                ? value
                : updatedPosition.endMonth,
            endYear:
              stillWorking && value === true
                ? ''
                : endedJob && field === WorkHistoryFields.END_YEAR
                ? value
                : updatedPosition.endYear,
            stillWorking: endedJob
              ? false
              : field === WorkHistoryFields.STILL_WORKING
              ? value
              : updatedPosition.stillWorking,
          },
        ],
      },
    ],
  });
};

/**
 * @description Sets an empty company to state
 * @param {number} uniqueIndex
 * @param {State} state
 * @param {Function} setState
 * @param {Function} setUniqueIndex
 * @returns {void}
 */
export const setEmptyCompany = (uniqueIndex: number, state: State, setState, setUniqueIndex): void => {
  setState({
    ...state,
    companies: [
      ...state.companies,
      {
        companyName: '',
        index: uniqueIndex + 1,
        positions: [{ index: uniqueIndex + 2 }],
      },
    ],
  });

  setUniqueIndex(uniqueIndex + 3);
};

/**
 * @description Gets employment histories from the redux store
 * @param currentApplication
 * @param {Function} setState
 * @param {number} uniqueIndex
 * @param {Function} setUniqueIndex
 * @param {State} state
 * @returns {void}
 */
export const getEmploymentHistories = (
  currentApplication: any,
  setState: any,
  uniqueIndex: number,
  setUniqueIndex: any,
  state: State,
): void => {
  const employmentHistory: StateCompany[] = currentApplication.resume.workHistory;
  let currentIndex = uniqueIndex;

  if (employmentHistory) {
    if (employmentHistory.length) {
      const companies: StateCompany[] = employmentHistory.map((company: StateCompany, index: number) => {
        const positions: StatePosition[] = company.positions;

        currentIndex += positions ? positions.length + 1 : 1;

        return {
          companyName: company.companyName,
          positions: positions
            ? positions.length
              ? positions.map((position: StatePosition, index: number) => ({
                  ...position,
                  startMonth: getMonthName(position.startMonth),
                  endMonth: getMonthName(position.endMonth),
                  index: position.index ? position.index : uniqueIndex + index,
                }))
              : [{ index: uniqueIndex + index, title: '', experience: '', stillWorking: false, addressCountry: '' }]
            : [{ index: uniqueIndex + index, title: '', experience: '', stillWorking: false, addressCountry: '' }],
          index: company.index ? company.index : uniqueIndex + currentIndex,
        };
      });

      setState({
        ...state,
        companies,
      });

      setUniqueIndex(currentIndex + 1);
    } else {
      setState({
        ...state,
        companies: [{ companyName: '', index: currentIndex + 1, positions: [{ index: currentIndex + 2 }] }],
      });

      setUniqueIndex(currentIndex + 3);
    }
  } else {
    setState({
      ...state,
      companies: [{ companyName: '', index: currentIndex + 1, positions: [{ index: currentIndex + 2 }] }],
    });
    setUniqueIndex(currentIndex + 3);
  }
};

/**
 * @description handles update of positions with the company name
 * @param {State} state
 * @returns {Company[]}
 */
export const getPositionsHistory = (state: State): Company[] =>
  state.companies.map((company: StateCompany) => ({
    ...company,
    positions: company.positions.map((position: StatePosition) => ({
      ...position,
      startMonth: position.startMonth ? getIntegerMonth(position.startMonth) : '',
      endMonth: position.endMonth ? getIntegerMonth(position.endMonth) : '',
    })),
  }));

/**
 * @description Removes index key from being sent to the backend
 * @param {StateCompany[]} companies
 * @returns {Company[]}
 */
export const formatWorkHistoryData = (companies: StateCompany[]): Company[] =>
  companies.map((company: StateCompany) => {
    const { index, ...restProps } = company;

    return {
      ...restProps,
      positions: company.positions.map((position: StatePosition) => {
        const { index, ...restProps } = position;
        return {
          ...restProps,
        };
      }),
    };
  });

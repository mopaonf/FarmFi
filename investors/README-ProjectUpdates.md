# Transaction Screen - Project Updates Enhancement

This document explains the implementation of the enhanced "Project Updates" feature in the transaction screen.

## Overview

The Project Updates section now displays additional investment data for each project:

1. Total units the user has invested in each project
2. Expected profit on the first refund
3. Real-time elapsed clock showing time since investment

## Components and Files

### Main Components:

-  `ProjectUpdateItem.tsx`: Enhanced to display investment statistics
-  `transaction.tsx`: Modified to pass investment data to the ProjectUpdateItem component

### Added:

-  `useElapsedTime.ts`: Custom hook for real-time elapsed time calculation

## Implementation Details

### Investment Data Calculation

The transaction screen now groups investments by project and calculates:

-  Total units invested in each project
-  Total investment amount
-  Earliest investment date for elapsed time calculation
-  Expected profit based on project return rate

### Elapsed Time Feature

The elapsed time is calculated using a custom React hook that:

-  Takes a start date (investment date)
-  Calculates the difference between the start date and current time
-  Updates the display every minute
-  Shows the elapsed time in days, hours, and minutes format

### UI/UX Improvements

The ProjectUpdateItem component now shows:

-  Project name with total units badge
-  Investment summary with:
   -  Units invested and total value
   -  Real-time elapsed time clock since investment
   -  Expected profit on first refund in a highlighted section

## Data Flow

1. Backend API provides investment data via `/api/investments/my-investments`
2. Transaction screen processes this data to calculate investment totals per project
3. ProjectUpdateItem renders the enhanced UI with investment statistics
4. Real-time elapsed time is calculated and updated using the useElapsedTime hook

## Future Enhancements

Potential improvements for future iterations:

-  Add countdown to next payment date
-  Include historical profit data
-  Show progress towards ROI goals
-  Include detailed project milestones with images

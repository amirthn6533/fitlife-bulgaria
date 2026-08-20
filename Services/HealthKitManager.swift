// HealthKitManager.swift
import Foundation
import HealthKit

/// A singleton that handles HealthKit authorisation and simple data queries.
final class HealthKitManager {
    // MARK: - Public properties
    static let shared = HealthKitManager()
    let healthStore = HKHealthStore()
    
    // MARK: - Types
    /// Types we want to read/write.
    private var readTypes: Set<HKObjectType> {
        var types = Set<HKObjectType>()
        if let stepCount = HKObjectType.quantityType(forIdentifier: .stepCount) {
            types.insert(stepCount)
        }
        if let heartRate = HKObjectType.quantityType(forIdentifier: .heartRate) {
            types.insert(heartRate)
        }
        // Add more types here (e.g., activeEnergyBurned, distanceWalkingRunning, …)
        return types
    }
    
    private var writeTypes: Set<HKSampleType> {
        // For now we only read; add write types when you need to save data.
        return []
    }
    
    // MARK: - Initialiser
    private init() { }
    
    // MARK: - Authorisation
    /// Request read/write permissions from the user.
    func requestAuthorization(completion: @escaping (Result<Bool, Error>) -> Void) {
        guard HKHealthStore.isHealthDataAvailable() else {
            completion(.failure(NSError(domain: "HealthKit", code: 1,
                                        userInfo: [NSLocalizedDescriptionKey: "HealthKit not available on this device"])) )
            return
        }
        healthStore.requestAuthorization(toShare: writeTypes, read: readTypes) { success, error in
            DispatchQueue.main.async {
                if let err = error {
                    completion(.failure(err))
                } else {
                    completion(.success(success))
                }
            }
        }
    }
    
    // MARK: - Data fetching
    /// Fetch step count for the current day.
    func fetchTodayStepCount(completion: @escaping (Result<Int, Error>) -> Void) {
        guard let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount) else {
            completion(.failure(NSError(domain: "HealthKit", code: 2,
                                        userInfo: [NSLocalizedDescriptionKey: "Step Count type unavailable"])) )
            return
        }
        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: Date())
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: Date(), options: .strictStartDate)
        let query = HKStatisticsQuery(quantityType: stepType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
            DispatchQueue.main.async {
                if let err = error {
                    completion(.failure(err))
                    return
                }
                let steps = result?.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0
                completion(.success(Int(steps)))
            }
        }
        healthStore.execute(query)
    }
    
    /// Fetch the most recent heart‑rate measurement.
    func fetchLatestHeartRate(completion: @escaping (Result<Double, Error>) -> Void) {
        guard let hrType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            completion(.failure(NSError(domain: "HealthKit", code: 3,
                                        userInfo: [NSLocalizedDescriptionKey: "Heart Rate type unavailable"])) )
            return
        }
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        let query = HKSampleQuery(sampleType: hrType, predicate: nil, limit: 1, sortDescriptors: [sortDescriptor]) { _, samples, error in
            DispatchQueue.main.async {
                if let err = error {
                    completion(.failure(err))
                    return
                }
                guard let sample = samples?.first as? HKQuantitySample else {
                    completion(.failure(NSError(domain: "HealthKit", code: 4,
                                                userInfo: [NSLocalizedDescriptionKey: "No heart‑rate samples found"])) )
                    return
                }
                let bpm = sample.quantity.doubleValue(for: HKUnit(from: "count/min"))
                completion(.success(bpm))
            }
        }
        healthStore.execute(query)
    }
}

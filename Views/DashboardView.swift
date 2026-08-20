// DashboardView.swift
import SwiftUI

struct DashboardView: View {
    @State private var steps: Int = 0
    @State private var heartRate: Double = 0
    @State private var authError: String?
    
    var body: some View {
        VStack(spacing: 20) {
            if let err = authError {
                Text("⚠️ \(err)")
                    .foregroundColor(.red)
            }
            Text("👣 قدم‌های امروز: \(steps)")
                .font(.title2)
                .foregroundColor(.primary)
            Text("❤️ نبض: \(Int(heartRate)) BPM")
                .font(.title2)
                .foregroundColor(.primary)
            
            Button(action: requestHealthAccess) {
                Text("به HealthKit وصل شو")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
        .background(
            // glass‑morphism card background
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.black.opacity(0.2))
                .blur(radius: 10)
        )
        .foregroundColor(.white)
    }
    
    private func requestHealthAccess() {
        HealthKitManager.shared.requestAuthorization { result in
            switch result {
            case .success(let granted):
                if granted {
                    loadData()
                } else {
                    authError = "دسترسی رد شد"
                }
            case .failure(let err):
                authError = err.localizedDescription
            }
        }
    }
    
    private func loadData() {
        HealthKitManager.shared.fetchTodayStepCount { res in
            if case .success(let count) = res { steps = count }
        }
        HealthKitManager.shared.fetchLatestHeartRate { res in
            if case .success(let bpm) = res { heartRate = bpm }
        }
    }
}

// Preview for SwiftUI canvas
struct DashboardView_Previews: PreviewProvider {
    static var previews: some View {
        DashboardView()
            .preferredColorScheme(.dark)
    }
}
